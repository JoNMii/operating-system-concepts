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
			var evicted = self.onEvict(); // RAM slot
			var evictedPage = getPagesInRAM()[evicted];
			console.assert(evictedPage !== undefined, "Cannot evict page " + evicted + ": not in RAM! ");
			console.log("About to evict page",evicted);
			//search for existing pages with the matching id			
			var swapSlot = findSWAPSlotByPageId(evictedPage.page_id);
			if(swapSlot<=-1){
				swapSlot = getFreeSWAPSlot();
			}
			if(swapSlot<=-1){
				console.error("OH SHIT IM out of MEMORY");
				stopAlgo();
				return -1;
			}

			deletePageFromRAM(evictedPage);
			writePageToSwap(evictedPage, swapSlot);

			if (swapSlot in visualObjects.pagefileSlots) {
				Graphics.enqueueDrawingEvent(function(){
					animateInterchange(evicted, swapSlot)
				});
			} else {
				Graphics.enqueueDrawingEvent(function(){
					animateRamToSwap(evicted, swapSlot)
				});
			}

			return evicted;
		};
		
		if(pageInRAM){
			//page in RAM
			//nothing to do here
			pageHit(pageId);
			Graphics.enqueueDrawingEvent(function() {
				animatePageHit();
			});
		} else 
			if(pageInSWAP){
				//page is in swap file move it to RAM
				var target = getFreeRAMSlot();
				if(target <= -1){
					target = evictPage();
				}

				deletePageFromSWAP(pageInSWAP);
				writePageToRAM(pageInSWAP,target);

			} else {
				//page is not realized, create it
				var target = getFreeRAMSlot();
				if(target <= -1){
					target = evictPage();
				}

				if(target <= -1){
					console.error('Failed to evict a page!');
					return -1;
				}

				createPage(target, pageId);

				Graphics.enqueueDrawingEvent(function() {
					animateCreatePage(target);
				});
			}
    	};
	this.init=function(){console.log("init called");};
}
