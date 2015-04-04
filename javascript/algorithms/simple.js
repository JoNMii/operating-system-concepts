function simpleAlgorithm() {
	var self = this;
	this.name="Name me";
	this.onEvict = function(){
		console.log("Implement me!!!");
		return 0;
	};
	this.onEvent = function(event) {
		Graphics.enqueueDrawingEvent(function () {
			animateEvent(event);
		});

		var pid = event.pid;
		var pageId = addressToPageId(event.address);
		var pageInRAM = findRAMPageById(pageId);
		var pageInSWAP = findSWAPPageById(pageId);

		var evictPage = function() {
			var evicted = self.onEvict(); // RAM slot
			console.assert(typeof evicted === "number", "onEvict() must return a number! Got " + typeof evicted + " instead...");
			var evictedPage = getPagesInRAM()[evicted];
			console.assert(evictedPage !== undefined, "Cannot evict page " + evicted + ": not in RAM! ");
			console.log("About to evict page slot ",evicted," ",evictedPage);
			//search for existing pages with the matching id
			var swapSlot = findSWAPSlotByPageId(evictedPage.page_id);

			if(swapSlot<=-1){
				swapSlot = getFreeSWAPSlot();
			}
			if(swapSlot<=-1){
				console.error("OH SHIT IM out of MEMORY");
                outOfMemoryShow();
				stopAlgo();
				return -1;
			}

			writePageToSwap(evictedPage, swapSlot);
			deletePageFromRAM(evictedPage);

			Graphics.enqueueDrawingEvent(function() {
				animateRamToSwap(evicted, swapSlot);
			});

			return evicted;
		};

		if(pageInRAM) {
			//nothing to do here
			pageHit(pageId);
			var memorySlot = findRAMSlotByPageId(pageId);
			Graphics.enqueueDrawingEvent(function() {
				animatePageHit(memorySlot);
			});

		} else if (pageInSWAP) {
			//page is in swap file move it to RAM
			var swapSlot = findSWAPSlotByPageId(pageInSWAP.page_id);
			var target = getFreeRAMSlot();
			if (target <= -1) {
				target = evictPage();
				if (target <= -1) {
					// Out of memory
					return -1;
				}
			}

			writePageToRAM(pageInSWAP, target);
			deletePageFromSWAP(pageInSWAP);

			Graphics.enqueueDrawingEvent(function () {
				animateSwapToRam(target, swapSlot);
			});

		} else {
			//page is not realized, create it
			var target = getFreeRAMSlot();
			if (target <= -1) {
				target = evictPage();
				if (target <= -1) {
					// Out of memory
					return -1;
				}
			}
			console.log('Creating page in memory slot ' + target + ' (pageId:' + pageId + ')');
			createPage(target, pageId);

			Graphics.enqueueDrawingEvent(function () {
				animateCreatePage(pid, target);
			});
		}
	};
	this.init=function(){console.log("init called");};
}
