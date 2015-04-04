var FIFO_Algorithm = function(){
	var turn = 0;
	var simple = new simpleAlgorithm();
	simple.name="FIFO";
	simple.onEvict = function(){
		var pages = getPagesInRAM();
		var oldest = getFlags(pages[0]).created;
		var result = 0;
		for(i in pages){
			var created = getFlags(pages[i]).created;
			console.log("Created on",created, pages[i]);
			if(created === undefined){
				return parseInt(i);
			}
			if(oldest>created){
				oldest = created;
				result = parseInt(i);
			}
		}
		return result;
	}
	var defaultOnEvent = simple.onEvent;
	simple.onEvent=function(event){
		turn++;
		var pageId = addressToPageId(event.address);
		var existed = (findRAMPageById()!=null) || (findSWAPPageById()!=null);
		defaultOnEvent(event);
		// if it did not exists, then it is created
		if(!existed){
			console.log("Create detected"+pageId);
			setFlags(pageId,{"created":turn});
		}
	}

	return simple;
}();
