let reqHistory = [];

function clearReqHistory() {
  reqHistory = [];
}

function rateLimiter(reqLimit, reqTimeLimit) {
  const timeStamp = Date.now();
  //  Empty reqHistory if current timestamp is greater then the reqTimeLimit
  if (timeStamp - reqHistory[0] > reqTimeLimit) clearReqHistory();
  reqHistory.push(timeStamp);
  if (reqHistory.length === 1) return true;
  //  If number of requests is less than the limit and less than the time limit
  if (reqHistory.length <= reqLimit && timeStamp - reqHistory[0] <= reqTimeLimit) return true;
  return false;
}


module.exports = { rateLimiter, clearReqHistory };
