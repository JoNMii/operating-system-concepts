var FIFO_Algorithm = function(){
	var turn = 0; //???

	var simple = new simpleAlgorithm();

	simple.onEvict = function(){
		var pages = getPagesInRAM();
		var oldestPage = pages[0];

		var oldestLU = getFlags(oldestPage).last_use;

		var result = 0;
		for(i in pages){
			var LU = getFlags(pages[i]).last_use;
			console.log("Last usage",LU,pages[i]);
			if(LU === undefined){
				return i;
			}
			if(oldestLU>LU){
				oldestLU = LU;
				oldestPage = pages[i];
				result = i;
			}
		}
		return result;
	}
	
	var defaultOnEvent = simple.onEvent;
	simple.onEvent=function(event){
		turn++;
		var pageId = addressToPageId(event.address);
		defaultOnEvent(event);
		setFlags(pageId,{"last_use":turn});
	}
	simple.name="FIFO";
	return simple;
}();
