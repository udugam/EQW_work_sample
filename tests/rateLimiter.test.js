const rateLimiter = require('../rateLimiter.js');

//  Define API rate limit here
const reqLimit = 4;
const reqTimeLimit = 1000;

test(`Tests 5 requests with limit of ${reqLimit}`, () => {
  expect(rateLimiter(5,reqLimit)).toBe(false);
});

test('Tests 4 requests with limit of ${reqLimit}', () => {
  expect(rateLimiter(4,reqLimit)).toBe(true);
});
