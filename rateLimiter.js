let reqHistory = [];

function rateLimiter(reqLimit, reqTimeLimit) {
  const timeStamp = Date.now();
  reqHistory.push(timeStamp);
  console.log(reqHistory);
  if (reqHistory.length === 1) return true;
  //  If number of requests is less than the Limit and less than the time Limit
  if (reqHistory.length <= reqLimit && timeStamp - reqHistory[0] <= reqTimeLimit) return true;
  return false;
}

function clearReqHistory() {
  reqHistory = [];
}

module.exports = { rateLimiter, clearReqHistory };
