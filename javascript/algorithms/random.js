var randomAlgorithm = {
	"name":"Pick stuff at random",
	"onEvent": function(event) {
		var pageId = addressToPageId(event.address);
		var ramSlot = findRAMPageById(pageId);
		var swapSlot = findSWAPPageById(pageId);
		
		if(ramSlot > -1){
			//page in RAM nothing to do here
		} else if((swapSlot <= -1) ){
			//page is in swap file move it to RAM
		} else {
			//page is not realized, create it
		}
    },
	"init" : function(){console.log("init called");}
}