var _Debug = function(){
    this.showInfo = true;
    this.info  = function(msg){
        console.log('[info] ' + msg);
    }
}
var KDebug = new _Debug(); 
module.exports = KDebug;