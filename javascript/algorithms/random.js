var randomAlgorithm = {
	"name":"Pick stuff at random",
	"onEvent": function(event) {
		var pageId = addressToPageId(event.address);
		var pageInRAM = findRAMPageById(pageId);
		var pageInSWAP = findSWAPPageById(pageId);
		
		var evictPage = function(){
			var totalPages = pageSlotsInRAM();
			var evicted = Math.random*pageSlotsInRAM();
			var swapSlot = getFreeRAMSlot()
			if(swapSlot<=-1){
				console.error("OH SHIT IM out of RAM");
				return -1;
			}
			writePageToSwap(getPagesInRAM()[evicted],swapSlot);
			
			return evicted;
		}
		
		if(pageInRAM){
			//page in RAM
			//nothing to do here
			pageHit(pageId);
		} else 
			if(pageInSWAP){
				//page is in swap file move it to RAM
				var target = getFreeRAMSlot();
				if(target <= -1){
					target = evictPage();
				}
				writePageToRAM(pageInSWAP,target);
			} else {
				//page is not realized, create it
				var target = getFreeRAMSlot();
				if(target <= -1){
					target = evictPage();
				}
				createPage(target, pageId);
			}
    },
	"init" : function(){console.log("init called");}
}