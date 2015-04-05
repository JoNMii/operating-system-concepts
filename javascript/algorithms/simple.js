function simpleAlgorithm() {
	var self = this;
	this.name="Name me";
	this.onEvict = function(){
		console.log("Implement me!!!");
		return 0;
	};
	
	this.dumpStatus = function(){}
	this.postEvict = function(slot,id){
		printUI("Page evicted! slot:"+slot+" page id:"+id);
	}
	
	this.onEvent = function(event) {
		Graphics.enqueueDrawingEvent(function () {
			animateEvent(event);
		});

		var pid = event.pid;
		var _pageId = event.real_id;
		var pageInRAM = findRAMPageById(_pageId);
		var pageInSWAP = findSWAPPageById(_pageId);

		var evictPage = function() {
			self.dumpStatus();
			var evicted = self.onEvict(); // RAM slot
			console.assert(typeof evicted === "number", "onEvict() must return a number! Got " + typeof evicted + " instead...");
			var evictedPage = getPagesInRAM()[evicted];
			self.postEvict(evicted,pageId(evictedPage));
			console.assert(evictedPage !== undefined, "Cannot evict page " + evicted + ": not in RAM! ");
			console.log("About to evict page slot ",evicted," ",evictedPage);
			//search for existing pages with the matching id
			var swapSlot = findSWAPSlotByPageId(pageId(evictedPage));

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

			statsObj.pageFaults++;
			Graphics.enqueueDrawingEvent(function() {
				animateRamToSwap(evicted, swapSlot);
			});

			return evicted;
		};

		if(pageInRAM) {
			//nothing to do here
			pageHit(_pageId);
			var memorySlot = findRAMSlotByPageId(_pageId);
			Graphics.enqueueDrawingEvent(function() {
				animatePageHit(memorySlot);
			});

		} else if (pageInSWAP) {
			//page is in swap file move it to RAM
			var swapSlot = findSWAPSlotByPageId(pageId(pageInSWAP));
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
			console.log('Creating page in memory slot ' + target + ' (pageId:' + _pageId + ')');
			createPage(target, _pageId);

			Graphics.enqueueDrawingEvent(function () {
				animateCreatePage(pid, target);
			});
		}
	};
	this.init=function(){console.log("init called");};
}
