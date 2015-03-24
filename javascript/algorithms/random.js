var randomAlgorithm = {
	"name":"Pick stuff at random",
	"onEvent": function(event) {
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
    },
	"init" : function(){console.log("init called");}
}