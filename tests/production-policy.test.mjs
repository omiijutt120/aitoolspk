import test from 'node:test';
import assert from 'node:assert/strict';
import { productionRequestAllowed, hasNoindexDirective } from '../scripts/production-policy.mjs';
test('missing robots is indexable by default and noindex must be an exact token', () => {
  assert.equal(hasNoindexDirective(null),false);
  assert.equal(hasNoindexDirective('noindex-preview'),false);
  assert.equal(hasNoindexDirective('NOINDEX, FOLLOW'),true);
});
test('production smoke permits only HTTPS GET/HEAD on exact host', () => {
  assert.equal(productionRequestAllowed('https://aitoolspk.tech/tools/', 'GET'), true);
  for (const [url,method] of [
    ['http://aitoolspk.tech/','GET'], ['https://evil.test/','GET'],
    ['https://aitoolspk.tech.evil.test/','GET'], ['https://aitoolspk.tech/','POST'],
    ['https://wa.me/123','GET'], ['https://aitoolspk.tech:8443/','GET'],
  ]) assert.equal(productionRequestAllowed(url,method),false);
});
