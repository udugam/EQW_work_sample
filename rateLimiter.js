    
module.exports = {
    reqHistory: [],
    checkLimit: function(reqLimit, reqTimeLimit) {
        this.reqHistory.push(Date.now())
        if(this.reqHistory.length>reqLimit) return false
        return true
    },
    init: function(){
        this.reqHistory = []
    }

}