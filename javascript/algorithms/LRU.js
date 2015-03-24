var LRU_Algorithm = {
    "name" : "Least Recently Used",
    "init" : function() {},
    "onEvent" : function(event) {
        var read = function(address) {
            
        };
        
        var write = function(address) {
            
        };
        
        switch(event.type) {
            case "read":
                read(event.address);
                break;
            case "write":
                write(event.address);
                break;
            default:
                throw "Unimplemented event type: " + event.type;
        }
    }
}
