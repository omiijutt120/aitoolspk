import test from 'node:test';
import assert from 'node:assert/strict';
import { productionRequestAllowed } from '../scripts/production-policy.mjs';
test('production smoke permits only HTTPS GET/HEAD on exact host', () => {
  assert.equal(productionRequestAllowed('https://aitoolspk.tech/tools/', 'GET'), true);
  for (const [url,method] of [
    ['http://aitoolspk.tech/','GET'], ['https://evil.test/','GET'],
    ['https://aitoolspk.tech.evil.test/','GET'], ['https://aitoolspk.tech/','POST'],
    ['https://wa.me/123','GET'], ['https://aitoolspk.tech:8443/','GET'],
  ]) assert.equal(productionRequestAllowed(url,method),false);
});
