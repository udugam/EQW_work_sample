const { rateLimiter, clearReqHistory } = require('../rateLimiter.js');

//  Define API rate limit here
const reqLimit = 4;
const reqTimeLimit = 1000;

let result = '';

//  Set Default jest timeout to 1 minute
setTimeout(60000);

function timeout(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

test('Tests 5 requests in 1 second', async () => {
  for (let i = 0; i < 5; i += 1) {
    result = rateLimiter(reqLimit, reqTimeLimit);
    if (result === false) break;
    await timeout(200)
  }
  expect(result).toBe(false);
});

test('Tests 4 requests in 1 second', async () => {
  clearReqHistory();
  for (let i = 0; i < 4; i += 1) {
    result = rateLimiter(reqLimit, reqTimeLimit);
    if (result === false) break;
    await timeout(250)
  }
  expect(result).toBe(true);
});

test('Tests 6 requests in 2 seconds', async () => {
    clearReqHistory();
    for (let i = 0; i < 6; i += 1) {
      result = rateLimiter(reqLimit, reqTimeLimit);
      if (result === false) break;
      await timeout(333)
    }
    expect(result).toBe(true);
  });