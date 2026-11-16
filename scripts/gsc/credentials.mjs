/**
 * Search Console credentials without adding a dependency.
 *
 * The Search Console APIs accept a service account: the owner creates one in
 * Google Cloud, adds its `…@….iam.gserviceaccount.com` address as a user on
 * the property, and drops the JSON key into an environment variable or a file.
 * That is a free path with no OAuth client, no redirect URI and no refresh
 * token to store, so the whole flow is a JWT signed with Node's own crypto.
 *
 * Nothing here ever prints a credential. The service account address is shown
 * because it is the value the owner has to paste into Search Console.
 */
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
export const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

export class GscConfigError extends Error {
  constructor(message, { code = 'GSC_CONFIG' } = {}) {
    super(message);
    this.name = 'GscConfigError';
    this.code = code;
  }
}

const base64url = (value) => Buffer.from(value).toString('base64url');

/**
 * Builds the signed JWT assertion that Google exchanges for an access token.
 * Exported so a test can verify the signature against a throwaway key pair.
 */
export function buildAssertion(
  credentials,
  {
    scope = GSC_SCOPE,
    now = Math.floor(Date.now() / 1000),
    lifetime = 3600,
  } = {}
) {
  const { client_email: email, private_key: privateKey } = credentials ?? {};
  if (!email || !privateKey)
    throw new GscConfigError(
      'Service account JSON must contain client_email and private_key.'
    );
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: email,
      scope,
      aud: TOKEN_ENDPOINT,
      iat: now,
      exp: now + lifetime,
    })
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  signer.end();
  const signature = signer.sign(privateKey, 'base64url');
  return `${header}.${claims}.${signature}`;
}

function parseServiceAccount(text, source) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new GscConfigError(`${source} is not valid JSON.`);
  }
  if (parsed.type && parsed.type !== 'service_account')
    throw new GscConfigError(
      `${source} is a "${parsed.type}" credential; a service_account key is required.`
    );
  if (!parsed.client_email || !parsed.private_key)
    throw new GscConfigError(
      `${source} needs client_email and private_key; download the JSON key again.`
    );
  return parsed;
}

/**
 * Returns the service account described by the environment, or null.
 * `GSC_ACCESS_TOKEN` is handled by the caller because it needs no signing.
 */
export function resolveServiceAccount(env = process.env) {
  const inline = env.GSC_SERVICE_ACCOUNT?.trim();
  if (inline) return parseServiceAccount(inline, 'GSC_SERVICE_ACCOUNT');
  const file =
    env.GSC_SERVICE_ACCOUNT_FILE?.trim() ||
    env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!file) return null;
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    throw new GscConfigError(
      `Could not read the service account file at ${file}.`
    );
  }
  return parseServiceAccount(text, file);
}

export const CREDENTIAL_HELP = `No Search Console credential found.

Use one of these, then run the command again:

  1. A service account (recommended, no browser flow):
     - Google Cloud console -> create a project -> enable "Google Search Console API"
     - IAM -> Service Accounts -> create -> Keys -> Add key -> JSON
     - In Search Console -> Settings -> Users and permissions -> Add user
       -> paste the service account address -> Full (or Restricted)
     - Set GSC_SERVICE_ACCOUNT_FILE to the downloaded .json path
       (or GSC_SERVICE_ACCOUNT to its contents)

  2. A short-lived token, if you already have one:
     - set GSC_ACCESS_TOKEN (gcloud auth print-access-token)

Nothing is stored by this repository, and reports/ is gitignored.`;
