(function () {
    "use strict";
    var A5 = function (params) {
        return A5.fn.init(params);
    };
    A5.fn = A5.prototype = {
        "init"  : function (params) {
            if(typeof params!="string"){
                this.debug.log("Document selected");
                this[0] = params;
            }else{
                if(typeof params!="undefined"){
                    var selector = document.querySelectorAll(params);
                    this.length = selector.length;
                    for (var a=0; a < this.length; a++) {
                        this[a] = selector[a];
                    }
                }
            }
            return this;        
        } 
    }
})();