const rateLimiter = require("../rateLimiter.js").rateLimiter
const clearReqHistory = require("../rateLimiter.js").clearReqHistory
const reqLimit = 4
const reqTimeLimit = 1000
let result = ""

//Set Default jest timeout to 1 minute
jest.setTimeout(60000)

function timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

test('Tests 5 requests in 1 second', async () => {
    for(let i=0; i<5; i++) {
        result = rateLimiter(reqLimit,reqTimeLimit)
        if(result===false) break
        await timeout(200)
    }
    expect(result).toBe(false);
});

test('Tests 4 requests in 5 seconds', async () => {
    clearReqHistory()
    for(let i=0; i<4; i++) {
        result = rateLimiter(reqLimit,reqTimeLimit)
        if(result===false) break
        await timeout(250)
    }
    expect(result).toBe(true);
});


