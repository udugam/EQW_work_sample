function rateLimiter(numRequests, requestLimit) {
  return numRequests <= requestLimit || false;
}


module.exports = rateLimiter;
