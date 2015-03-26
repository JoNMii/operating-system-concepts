function simpleAlgorithm() {
	var self = this;
	this.name="Name me";
	this.onEvict = function(){
		console.log("Implement me!!!");
		return 0;
	};
	this.onEvent = function(event) {
		var pageId = addressToPageId(event.address);
		var pageInRAM = findRAMPageById(pageId);
		var pageInSWAP = findSWAPPageById(pageId);
		
		var evictPage = function(){
			var totalPages = pageSlotsInRAM();
			var evicted = self.onEvict();
			console.log("About to evict page ",evicted);
			var swapSlot = getFreeSWAPSlot()
			if(swapSlot<=-1){
				console.error("OH SHIT IM out of MEMORY");
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
    	};
	this.init=function(){console.log("init called");};
}
