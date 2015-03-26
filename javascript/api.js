/*
CPU+RAM+Swap file
*/

/*** Global variables ***/
var config = {} // Animation configuration
var visualObjects = {} // Handlers for main graphical objects (CPU / Memory / Pagefile)

function startAlgo(params){
console.log("Simulation started:",params);

config.ramSize = params.ramSize;
config.virualMemorySize = params.virtMemSize;
config.frameSize = params.frameSize;
config.frameCount = params.frameCount;
config.speed = params.speed;
config.algo = params.algoNumber;
var algo = params.algoNumber;
if (algo == 0){ //FIFO/FCSF

} else if (algo == 1){ //Second-chance

} else if (algo == 2){ //LRU
	config.algo = LRU_Algorithm
} else if (algo == 3){ //LFU

} else if (algo == 5){ //Random
	config.algo = randomAlgorithm
}

//visualObjects = {}; // TODO: clear previously created objects

//updateGraphics();

var init = config.algo.init
if(init && !config.initialised){
 init();
 config.initialised = true;
}

setStep(params.speed);
unpauseAlgo();
};

function setStep(speed){
	config.speed = speed;
	if(config.timer){
		unpauseAlgo();
	}
}

function pauseAlgo(){
	var timer = config.timer;
	clearInterval(timer);
	delete config.timer;
}

function unpauseAlgo(){
	//timer already started
	if(config.timer){
		pauseAlgo();
	}
	var step = 1000/config.speed;
	config.timer = setInterval(function(){simulationTick()},step);
}

function stopAlgo(){
	pauseAlgo();
	config.initialised = false;
	data.clear();
}

function unpauseAlgo(){
	//timer already started
	if(config.timer){
		pauseAlgo();
	}
	var step = 1000/config.speed;
	config.timer = setInterval(function(){simulationTick()},step);
}

function stopAlgo(){
	pauseAlgo();
	config.initialised = false;
	data.clear();
}

//example requests
var exampleMEMrequestRead={
	"type":"read",
	"address":124//virtual address
}

var exampleMEMrequestWrite={
	"type":"write",
	"address":124,
	"data":13 //ignore the data for now
}
//------------

var examplePage ={
	"page_id":1,
	"min_address":24,
	"max_address":64
}

var examplePage2 ={
	"page_id":2,
	"min_address":16,
	"max_address":24
}

var examplePage3 ={
	"page_id":3,
	"min_address":64,
	"max_address":72
}

var exampleAlgorythm = {
	"name":"do nothing",
	"onEvent": function(event){console.log(event);},
	"init" : function(){console.log("init called");}
}

//example/mock implementation.
//replace with actual logic

//increases time by one timeunit
function simulationTick(){
	onEvent = algorythm().onEvent;
	onEvent(generateEvent());
	updateGraphics();
	drawMemorySlots();
	
	canvas.renderAll();
}

function generateEvent(){
    // Random: 50/50
    var requestType = Math.floor(2 * Math.random()) ? "read" : "write";
    // Random address from 0 to RAM_size - 1
    var address = Math.floor(config.virualMemorySize * Math.random());
    
    var request = {
        "type" : requestType,
        "address" : address,
        /* "data" : TODO: if necessary */
    };
    
	return request;
}

function updateGraphics(){
	//redraw/revalidate the visuals
    
    drawCPU();
    drawMemory();
    drawPagefile();
}

function resetSimulation(){
	stopAlgo();
}

function algorythm(){
	return config.algo;
}

function pageSlotsInRAM(){
	return config.frameCount;
}

function getFreeRAMSlot(){
	var usedSlots = Object.keys(getPagesInRAM());
	for(var i=0;i<pageSlotsInRAM();i++){
		var found = false;
		for(var j=0;j<usedSlots.length;j++){
			if(i==j){
				found = true;
			}
		}
		if(!found){
			return i;
		}
	}
	return -1;
}

function getPagesInRAM(){
	// slot_nr:page
	return data.in_ram;
}

function pageSlotsInSWAP(){
	return 30;
}

function pageSize(){
	return config.frameSize;
}

function getFreeSWAPSlot(){
	var usedSlots = Object.keys(getPagesInSWAP());
	for(var i=0;i<pageSlotsInSWAP();i++){
		var found = false;
		for(var j=0;j<usedSlots.length;j++){
			if(i==j){
				found = true;
			}
		}
		if(!found){
			return i;
		}
	}
	return -1;
}

function getPagesInSWAP(){
	return data.in_swap;
}

function getAllPages(){
	var aggregate = data.backless;
	for (var slot in data.in_swap) {
		aggregate.push(data.in_swap[slot])
	}
	for (var slot in data.in_ram) {
		aggregate.push(data.in_ram[slot])
	}
	return aggregate.getUniqueBy(pageId);
}

// possible flags (use others if needed)
// dirty, valid
// these flags should be included in page table if used

function setFlags(page,flags){
	data.flags[pageId(page)]=flags;
}

function getFlags(page){
	return data.flags[pageId(page)];
}

function pageHit(pageId){
	console.log("Page hit!",{"pageId":pageId});
}

//swapout
function writePageToSwap(page,swapSlot){
	if(0<=swapSlot && swapSlot<pageSlotsInSWAP()){
	console.log("page "+pageId(page)+" TO SWAP slot "+swapSlot);
		data.in_swap[swapSlot]=page;
	}
}

//swapin
function writePageToRAM(page,ramSlot){
	if(0<=ramSlot && ramSlot<pageSlotsInRAM()){
	console.log("page "+pageId(page)+" TO RAM slot "+ramSlot);
		data.in_ram[ramSlot]=page;
        
        visualObjects.memorySlots[ramSlot].fill = '#F00';
	}
}

function findRAMPageById(id){
	var pages = getPagesInRAM();
	for(i in pages){
		if(pageId(pages[i])==id){
			return pages[i];
		}
	}
	return null;
}

function findSWAPPageById(id){
	var pages = getPagesInSWAP();
	for(i in pages){
		if(pageId(pages[i])==id){
			return pages[i];
		}
	}
	return null;
}

function findSWAPSlotByPageId(id){
	var pages = getPagesInSWAP();
	for(i in pages){
		if(pageId(pages[i])==id){
			return i;
		}
	}
	return -1;
}

//delete page from both RAM and SWAP
function deletePage(page){
	data.deleteRAMPage(page);
	data.deleteSWAPPage(page);
}

function deletePageFromRAM(page){
	data.deleteRAMPage(page);
}

function deletePageFromSWAP(page){
	data.deleteRAMPage(page);
}

//create a page but do not assign it any memory
function createBacklessPage(pageId){
	return {
		"page_id":pageId,
		"min_address":pageId * pageSize(),
		"max_address":(pageId+1) * pageSize()
	};
}

function addressToPageId(address){
	return Math.floor(address/pageSize());
}

function createPage(ramSlot,pageId){
	var page = createBacklessPage(pageId);
	writePageToRAM(page,ramSlot);
	return page;
}
