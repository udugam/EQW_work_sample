// This file is intended to test the output of the rateLimiter function using the real passage of time
// I found it difficult to quickly setup a testing framework to mimic real-time behavior and opted for 
// creating my own testing framework for this real-time dependant function
// Tests are contained in their own blocks to avoid scope issues 

// const rateLimiter = require('../rateLimiter.js')
const reqLimit = 4
const reqTimeLimit = 5000
const rateLimiter = require('../rateLimiter.js')
let result = ""
let numRequests = 0
let reqCount = 0

//Methods required for testing
function stopInterval(interval) {
    clearInterval(interval)
}



//Testing a single request
rateLimiter.init()
result = rateLimiter.checkLimit(reqLimit,reqTimeLimit)
console.log(`1) Testing a single request: ${result===true? "PASS" : "FAIL"}\n`)


//Testing more requests than the limit
rateLimiter.init()
numRequests = reqLimit+1
for(let i=1; i<=numRequests; i++) {
    result = rateLimiter.checkLimit(reqLimit,reqTimeLimit)
    if(i===numRequests) {
        console.log(`2) Testing more requests than the limit of ${reqLimit}: ${result===false? "PASS" : "FAIL"}\n`)
    }
}

//Testing less requests than the limit within the allowable time limit
rateLimiter.init()
numRequests = reqLimit-1
reqCount = 0
console.log(`3) Testing less requests than the limit of ${numRequests} within ${reqTimeLimit/1000} seconds: `)
let requestInterval = setInterval(()=> {
    reqCount++
    result = rateLimiter.checkLimit(reqLimit,reqTimeLimit)
    console.log(`${reqCount}, ${rateLimiter.reqHistory}`)
    if(reqCount===numRequests) {
        console.log(`${result===true? "PASS" : "FAIL"}\n`)
        stopInterval(requestInterval)
    } 
}, Math.floor(reqTimeLimit/reqLimit))




