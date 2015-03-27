var second_chance = {
    var eventList;
	var simple = new simpleAlgorithm();
	simple.name = "Second Chance";
	var defaultOnEvent = simple.onEvent;
	simple.onEvict = function() {
	    while(true) {
	        var flags = getFlags(eventList[0]);
	        if (flags.count > 0) {
	            var tmp = eventList[0];
	            eventList.shift();
	            eventList.push(tmp);
	            flags.count = 0;
	            setFlags(tmp, flags);
	        } else {
	            var tmp = eventList[0];
	            eventList.shift();
	            return tmp;
	        }
	    }
	}
	simple.onEvent = function(event) {
	    var pageId = addressToPageId(event.address);
	    eventList.push(pageId);
	    var flags = getFlags(pageId);
	    if (flags.count) {
	        flags.count += 1;
	    } else {
	        flags.count = 0;
	    }
	    if (event.type == "write") {
	        flags.dirty = true;
	    }
	    defaultOnEvent(event);
	    setFlags(pageId, flags);
	}
	simple.init = function() {
	    console.log("init called");
	    eventList = new Array();
	}
}();
