#!/usr/bin/env node
/**
 * Print the Search Console properties this credential can read.
 *
 * The API needs the property identifier exactly as Search Console stores it:
 * `sc-domain:example.com` for a Domain property, `https://example.com/` for a
 * URL-prefix property. One wrong character returns a 404 that looks like an
 * auth problem, so this command exists to remove that ambiguity.
 *
 *   npm run gsc:sites
 */
import { getAccessToken, listSites } from './client.mjs';

const { token, source } = await getAccessToken();
const sites = await listSites({ token });
if (!sites.length) {
  console.error(
    'The credential can read no properties. In Search Console, open Settings → Users and permissions and add the service account address.'
  );
  process.exitCode = 1;
} else {
  console.log(`Credential: ${source}`);
  console.log('Properties:');
  for (const site of sites)
    console.log(`  ${site.permissionLevel.padEnd(15)} ${site.siteUrl}`);
  console.log(
    '\nPass the siteUrl with --site. A Domain property looks like sc-domain:aitoolspk.tech; a URL-prefix property looks like https://aitoolspk.tech/.'
  );
}
