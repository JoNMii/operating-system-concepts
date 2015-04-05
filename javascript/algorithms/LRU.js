var LRU_Algorithm = function(){
	var turn = 0;
	var simple = new simpleAlgorithm();
	simple.onEvict = function(){
		var pages = getPagesInRAM();
		var oldestLU = getFlags(pages[0]).last_use;
		var result = 0;
		for(i in pages){
			var LU = getFlags(pages[i]).last_use;
			console.log("Last usage",LU,pages[i]);
			if(LU === undefined){
				return parseInt(i);
			}
			if(oldestLU>LU){
				oldestLU = LU;
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
   	simple.dumpStatus = function(){
		var pages = getPagesInRAM();
		var queue = Object.keys(pages).map(
			function(k){
				var page = pages[k];
				var last_use = getFlags(page).last_use;
				return {"id":pageId(page),
					"last_use":last_use};
			});

		queue.sort(function(o1,o2){
			return o1.last_use - o2.last_use;
		});
		var displayable = queue.map(function(item){
			return item.id+"->"+item.last_use;
		})
		printUI("Map of pageId -> last usage "+(displayable.join(" ; ")));	
	}
	simple.name="LRU";
	return simple;
}();
