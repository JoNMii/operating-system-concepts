var MFU_Algorithm = function(){

	var simple = new simpleAlgorithm();

	simple.onEvict = function(){
		var pages = getPagesInRAM();
		var mostUsed = getFlags(pages[0]).used;
		var result = 0;
		for(i in pages){
			var used = getFlags(pages[i]).used;
			console.log("Used ",used," times",pages[i]);

			if(used === undefined){
				continue;
			}

			if(mostUsed<used){
				mostUsed = used;
				result = parseInt(i);
			}
		}
		return result;
	}

	var defaultOnEvent = simple.onEvent;

	simple.onEvent=function(event){
		var pageId = addressToPageId(event.address);
		defaultOnEvent(event);
		var flags = getFlags(pageId);
		var used = 0; 
		if(flags !== undefined){
			used = flags.used;
		}
		setFlags(pageId,{"used":used+1});
	}

	simple.name="MFU";
	return simple;
}();
