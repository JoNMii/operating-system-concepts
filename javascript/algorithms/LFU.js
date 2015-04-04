var LFU_Algorithm = function(){
	var simple = new simpleAlgorithm();
	simple.onEvict = function(){
		var pages = getPagesInRAM();
		var lessUsed = getFlags(pages[0]).used;
		var result = 0;
		for(i in pages){
			var used = getFlags(pages[i]).used;
			console.log("Used ",used," times",pages[i]);
			if(used === undefined){
				return parseInt(i);
			}
			if(lessUsed>used){
				lessUsed = used;
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
	simple.name="LFU";
	return simple;
}();
