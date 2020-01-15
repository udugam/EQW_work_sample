const rateLimiter = require("../rateLimiter.js")
const reqLimit = 4
const reqTimeLimit = 5000

function timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

test('Mimics 2 requests in 4 seconds', async () => {
    rateLimiter(reqLimit,reqTimeLimit)
    await timeout(4000)
    expect(rateLimiter(reqLimit,reqTimeLimit)).toBe(true);
});