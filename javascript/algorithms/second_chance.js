var eventlist = [];

var second_chance = function(){
	var simple = new simpleAlgorithm();
	simple.name = "Second Chance";
	var defaultOnEvent = simple.onEvent;
	
	simple.onEvict = function() {
	    while(true) {
	        var flags = getFlags(eventlist[0]);
		console.log(" flags ", flags," events ", eventlist);
	        if (flags && flags.count > 0) {
	            var tmp = eventlist[0];
	            eventlist.shift();
	            eventlist.push(tmp);
	            flags.count = 0;
	            setFlags(tmp, flags);
	        } else {
	            var tmp = eventlist[0];
	            eventlist.shift();

		    /*var pages = getPagesInRAM();
	            var z = findRAMPageById(tmp);
	            for(i in pages) {
	                if (pages[i] == z) {
	                    return parseInt(i);
	                }
	            }*/
		    
		    //maybe better
		    var result = findRAMSlotByPageId(tmp);
		    //page still exists
		    if(result!=-1){
	            	return result;
		    }
	        }
	    }
	}
	
    simple.onEvent = function(event) {
        var pageId = addressToPageId(event.address);
        if (eventlist.indexOf(pageId) == -1) {
            eventlist.push(pageId);
        }
        var flags = getFlags(pageId);
        if (!flags) {
            flags = {"count": 0};
        } else if (flags.count === undefined) {
            flags.count = 0;
        } else {
            flags.count += 1;
        }
        if (event.type == "write") {
            flags.dirty = true;
	    }
	    defaultOnEvent(event);
	    setFlags(pageId, flags);
	}
	
    simple.init = function() {
        console.log("init called");
        eventlist = [];
    }
    
    return simple;
}();
