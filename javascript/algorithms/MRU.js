var MRU_Algorithm = function(){
	var turn = 0;
	var simple = new simpleAlgorithm();

	simple.onEvict = function(){
		var pages = getPagesInRAM();
		var earliestLU = getFlags(pages[0]).last_use;
		var result = 0;
		for(i in pages){

			var LU = getFlags(pages[i]).last_use;
			console.log("Last usage",LU,pages[i]);

			if(LU === undefined){
				continue;
			}

			if(earliestLU<LU){
				earliestLU = LU;
				result = parseInt(i);
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

	simple.name="MRU";
	return simple;
}();
