var FIFO_Algorithm = function(){

	var simple = new simpleAlgorithm();
	simple.name="FIFO";

	simple.onEvict = function(){ 	//finds the page to swap out
		var pages = getPagesInRAM();
		var oldestPage = pages[0];
		return pageId(oldestPage);
	}

	var defaultOnEvent = simple.onEvent;

	simple.onEvent=function(event){
		
		defaultOnEvent(event);	//rekursija??
		
		var pageId = addressToPageId(event.address);

		if (eventlist.indexOf(pageId) == -1) {
            eventlist.push(pageId);
        }

        var flags = getFlags(pageId);

        if (event.type == "write") {
        	if (!flags) {
            flags = {"dirty": true};
        	} else {
        	    flags.dirty = true;
        	}
	    }
	
	    setFlags(pageId, flags);
	}

	return simple;
}();
