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
	simple.preEvict = function(){
		var pages = getPagesInRAM();
		pages = Object.keys(pages).map(function(k){return pages[k]});
		var queue = pages.map(function(page){
			var created = getFlags(page).created;
		console.log(page);
			return {"id":pageId(page),
				"created":created};
		});
		queue.sort(function(o1,o2){
			return o1.created - o2.created;
		});
		var pageIds = queue.map(function(item){
		console.log(item);
			return item.id;
		});
		printUI("Queue(page IDs): "+pageIds);	
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
