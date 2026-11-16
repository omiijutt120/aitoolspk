import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createVerify } from 'node:crypto';
import {
  buildAssertion,
  GscConfigError,
  GSC_SCOPE,
  resolveServiceAccount,
} from '../scripts/gsc/credentials.mjs';
import { getAccessToken } from '../scripts/gsc/client.mjs';
import { parseSitemapUrls } from '../scripts/gsc/sitemap.mjs';
import { buildQueue, inspectDeepLink } from '../scripts/gsc/queue.mjs';
import { parseArgs } from '../scripts/lib/args.mjs';
import { toCsv, parseCsv } from '../scripts/lib/csv.mjs';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

test('the JWT assertion carries the scope, audience and a valid RS256 signature', () => {
  const assertion = buildAssertion(
    {
      client_email: 'seo@example.iam.gserviceaccount.com',
      private_key: privateKey,
    },
    { now: 1_700_000_000 }
  );
  const [header, claims, signature] = assertion.split('.');
  assert.deepEqual(JSON.parse(Buffer.from(header, 'base64url')), {
    alg: 'RS256',
    typ: 'JWT',
  });
  assert.deepEqual(JSON.parse(Buffer.from(claims, 'base64url')), {
    iss: 'seo@example.iam.gserviceaccount.com',
    scope: GSC_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: 1_700_000_000,
    exp: 1_700_003_600,
  });
  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${header}.${claims}`);
  verifier.end();
  assert.equal(
    verifier.verify(publicKey, Buffer.from(signature, 'base64url')),
    true
  );
});

test('a credential with no service account and no token fails with instructions', async () => {
  await assert.rejects(
    () => getAccessToken({ env: {} }),
    (error) =>
      error instanceof GscConfigError &&
      /GSC_SERVICE_ACCOUNT_FILE/.test(error.message)
  );
});

test('a direct access token is used without a network call', async () => {
  const result = await getAccessToken({
    env: { GSC_ACCESS_TOKEN: 'ya29.direct' },
    fetchImpl: () => assert.fail('no request expected'),
  });
  assert.equal(result.token, 'ya29.direct');
  assert.equal(result.source, 'GSC_ACCESS_TOKEN');
});

test('a service account is exchanged for an access token with the JWT grant', async () => {
  let body = '';
  const result = await getAccessToken({
    env: {
      GSC_SERVICE_ACCOUNT: JSON.stringify({
        type: 'service_account',
        client_email: 'seo@example.iam.gserviceaccount.com',
        private_key: privateKey,
      }),
    },
    fetchImpl: async (url, init) => {
      assert.equal(url, 'https://oauth2.googleapis.com/token');
      body = String(init.body);
      return {
        ok: true,
        text: async () => JSON.stringify({ access_token: 'ya29.signed' }),
      };
    },
  });
  assert.equal(result.token, 'ya29.signed');
  assert.match(
    result.source,
    /service-account:seo@example\.iam\.gserviceaccount\.com/
  );
  assert.match(
    body,
    /grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer/
  );
  assert.match(body, /assertion=/);
});

test('a non-service-account key is rejected before any request', () => {
  assert.throws(
    () =>
      resolveServiceAccount({
        GSC_SERVICE_ACCOUNT: JSON.stringify({ type: 'authorized_user' }),
      }),
    /service_account/
  );
});

test('the sitemap parser dedupes and refuses another host', () => {
  const xml = `<urlset>
    <url><loc>https://aitoolspk.tech/a/</loc></url>
    <url><loc>https://aitoolspk.tech/a/</loc></url>
    <url><loc>https://aitoolspk.tech/b/</loc></url>
  </urlset>`;
  assert.deepEqual(parseSitemapUrls(xml), [
    'https://aitoolspk.tech/a/',
    'https://aitoolspk.tech/b/',
  ]);
  assert.throws(
    () => parseSitemapUrls('<url><loc>https://example.com/x/</loc></url>'),
    /outside/
  );
});

test('the inspection link encodes the property and the URL', () => {
  const link = inspectDeepLink(
    'sc-domain:aitoolspk.tech',
    'https://aitoolspk.tech/plans/netflix/'
  );
  assert.equal(
    link,
    'https://search.google.com/search-console/inspect?resource_id=sc-domain%3Aaitoolspk.tech&id=https%3A%2F%2Faitoolspk.tech%2Fplans%2Fnetflix%2F'
  );
});

test('a complete inspection removes indexed URLs and keeps release URLs', () => {
  const status = {
    checkedAt: '2026-11-16T10:00:00.000Z',
    inspected: 188,
    sitemapUrls: 188,
    notIndexed: [
      {
        url: 'https://aitoolspk.tech/plans/gemini/',
        verdict: 'NEUTRAL',
        coverageState: 'Crawled - currently not indexed',
      },
    ],
  };
  const result = buildQueue({ status });
  const urls = result.queue.map((entry) => entry.url);
  assert.ok(urls.includes('https://aitoolspk.tech/plans/gemini/'));
  assert.ok(urls.includes('https://aitoolspk.tech/'));
  assert.ok(!urls.includes('https://aitoolspk.tech/plans/claude/'));
  assert.ok(
    result.indexed.some(
      (entry) => entry.url === 'https://aitoolspk.tech/plans/claude/'
    ),
    'a complete run that did not flag claude proves it now passes'
  );
});

test('a partial inspection never claims a URL is indexed by omission', () => {
  const result = buildQueue({
    status: {
      checkedAt: '2026-11-16',
      inspected: 1,
      sitemapUrls: 188,
      notIndexed: [],
    },
  });
  assert.equal(result.indexed.length, 0);
  assert.ok(result.queue.some((entry) => entry.url.endsWith('/plans/claude/')));
});

test('arguments parse flags, values and inline equals', () => {
  const args = parseArgs(['--from', 'live', '--limit=20', '--dry-run'], {
    known: ['from', 'limit', 'dry-run'],
  });
  assert.equal(args.get('from'), 'live');
  assert.equal(args.number('limit'), 20);
  assert.equal(args.has('dry-run'), true);
  assert.throws(
    () => parseArgs(['--nope'], { known: ['from'] }),
    /Unknown flag/
  );
});

test('CSV survives a BOM, CRLF and quoted commas', () => {
  const text = '\uFEFFid,notes\r\n1,"a, b"\r\n2,"say ""hi"""\r\n';
  const rows = parseCsv(text);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].notes, 'a, b');
  assert.equal(rows[1].notes, 'say "hi"');
  const round = parseCsv(toCsv(rows, ['id', 'notes']));
  assert.deepEqual(
    round.map((row) => row.notes),
    ['a, b', 'say "hi"']
  );
});
