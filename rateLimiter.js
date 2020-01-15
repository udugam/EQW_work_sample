    
var reqHistory = []

function rateLimiter(reqLimit, reqTimeLimit) {
    let timeStamp = Date.now()
    reqHistory.push(timeStamp)
    console.log(reqHistory)
    if(reqHistory.length===1) return true
    if(reqHistory.length<=reqLimit && timeStamp-reqHistory[0]<=reqTimeLimit) { //If number of requests is less than the Limit and less than the time Limit
        return true
    } else {
        return false
    }    
}

function clearReqHistory() {
    reqHistory = []
}

module.exports = {rateLimiter, clearReqHistory}
