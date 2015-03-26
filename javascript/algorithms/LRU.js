var LRU_Algorithm = function(){
	var turn = 0;
	var simple = new simpleAlgorithm();
	simple.onEvict = function(){
		var pages = getPagesInRAM();
		var oldestPage = pages[0];
		var oldestLU = getFlags(oldestPage).last_use;
		for(i in pages){
			var LU = getFlags(pages[i]).last_use;
			if(LU === undefined){
				return pages[i];
			}
			if(oldestLU>LU){
				oldestLU = LU;
				oldestPage = pages[i];
			}
		}
		return oldestPage;
	}
	var defaultOnEvent = simple.onEvent;
	simple.onEvent=function(event){
		turn++;
		var pageId = addressToPageId(event.address);
		defaultOnEvent(event);
		setFlags(pageId,{"last_use":turn});
	}
	simple.name="LRU";
	return simple;
}();
