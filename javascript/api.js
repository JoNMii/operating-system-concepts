/*
CPU+RAM+Swap file
*/

/*** Global variables ***/
var config = {}; // Animation configuration
var statsObj = {
    freeRam:0,
    pagePool:0,
    pageHits:0,
    pageFaults:0
}; //Statistics object;

function startAlgo(params) {
	console.log("Simulation started:", params);

	console.assert(config.speed !== 0, "Error: speed is set to zero, expect division by zero exceptions!");

	config.ramSize = params.ramSize;
	config.virualMemorySize = params.virtMemSize;
	config.frameSize = params.frameSize;
	config.frameCount = params.frameCount;
	config.swapSize = params.swapSize;
	config.speed = params.speed;
	config.algo = params.algoNumber;
	config.waitUntilTimeStamp = -1;
	config.processMax = params.processMax;
	config.processMin = params.processMin;
    config.pagePerProcessMin = params.pagePerProcessMin;
    config.pagePerProcessMax = params.pagePerProcessMax;

	var algo = params.algoNumber;
	if (algo == 0) { //FIFO/FCSF
		config.algo = FIFO_Algorithm
	} else if (algo == 1) { //Second-chance
		config.algo = second_chance
	} else if (algo == 2) { //LRU
		config.algo = LRU_Algorithm
	} else if (algo == 3) { //LFU
		config.algo = LFU_Algorithm 
	} else if (algo == 5) { //Random
		config.algo = randomAlgorithm
	}
	statsObj.freeRam = config.ramSize;

	// Clear previously created objects
	clearGraphics();

	visualConfig.ramRows = Graphics.GridConfig[pageSlotsInRAM()].rows;
	visualConfig.ramCols = Graphics.GridConfig[pageSlotsInRAM()].cols;
	visualConfig.pfRows = Graphics.GridConfig[pageSlotsInSWAP()].rows;
	visualConfig.pfCols = Graphics.GridConfig[pageSlotsInSWAP()].cols;

	// Redraw everything anew
	updateGraphics();

	var init = config.algo.init;
	if (init && !config.initialised) {
		init();
		config.initialised = true;
	}

	setStep(params.speed);
	unpauseAlgo();
}

function setStep(speed){
	config.speed = speed;
	if(config.timer){
		unpauseAlgo();
	}
}

function sleep(milliseconds) {
	config.waitUntilTimeStamp = Date.now() + (milliseconds === undefined ? 2000000000 : milliseconds);
}

function awaken() {
	config.waitUntilTimeStamp = -1;
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
	//config.timer = setInterval(function(){simulationTick()},step);
	config.timer = setInterval(function(){processMaster.makeTick()},step);
}

function stopAlgo(){
	pauseAlgo();
	config.initialised = false;
	processMaster.killAll();
	data.clear();
}

//example requests
var exampleMEMrequestRead={
	"type":"read",
	"address":124//virtual address
};

var exampleMEMrequestWrite={
	"type":"write",
	"address":124,
	"data":13 //ignore the data for now
};
//------------

var examplePage ={
	"page_id":1,
	"min_address":24,
	"max_address":64
};

var examplePage2 ={
	"page_id":2,
	"min_address":16,
	"max_address":24
};

var examplePage3 ={
	"page_id":3,
	"min_address":64,
	"max_address":72
};

var exampleAlgorythm = {
	"name":"do nothing",
	"onEvent": function(event){console.log(event);},
	"init" : function(){console.log("init called");}
};

//example/mock implementation.
//replace with actual logic

//increases time by one timeunit
function simulationTick(event){
	if (Date.now() < config.waitUntilTimeStamp) {
		//console.log('Sleeping...');
		return;
	}
	var onEvent = algorythm().onEvent;
	//onEvent(generateEvent());
	onEvent(event);
	updateGraphics();
    updateStatistics();
}

function generateEvent(){
    // Random: 50/50
    var requestType = Math.floor(2 * Math.random()) ? "read" : "write";
    // Random address from 0 to RAM_size - 1
    var address = Math.floor(config.virualMemorySize * Math.random());
    
    var request = {
		"pid" : 0, // TODO: update with real PID
        "type" : requestType,
        "address" : address
    };
    
	return request;
}

function resetSimulation(){
	stopAlgo();
	clearGraphics();
	updateGraphics();
}

function algorythm(){
	return config.algo;
}

function pageSlotsInRAM(){
	return config.frameCount;
}

function getFreeRAMSlot(){
	var pages = getPagesInRAM();
	for (var i = 0; i < pageSlotsInRAM(); i++) {
		if (!(i in pages)) {
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
	return Math.floor(config.swapSize / config.frameSize);
}

function pageSize(){
	return config.frameSize;
}

function getFreeSWAPSlot(){
	var pages = getPagesInSWAP();
	for (var i = 0; i < pageSlotsInSWAP(); i++) {
		if (!(i in pages)) {
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
	statsObj.pageHits++;
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

function findRAMSlotByPageId(id){
	var pages = getPagesInRAM();
	for(i in pages){
		if(pageId(pages[i])==id){
			return parseInt(i);
		}
	}
	return -1;
}

function findSWAPSlotByPageId(id){
	var pages = getPagesInSWAP();
	for(i in pages){
		if(pageId(pages[i])==id){
			return parseInt(i);
		}
	}
	return -1;
}

//delete page from both RAM and SWAP
function deletePage(page){
	var id = pageId(page);
	var ramPageId = findRAMSlotByPageId(id);
	var pfPageId = findSWAPSlotByPageId(id);
	Graphics.enqueueDrawingEvent(function () {
		animateDeletePage(ramPageId, pfPageId);
	});

	data.deleteRAMPage(page);
	data.deleteSWAPPage(page);
}

function deletePageFromRAM(page){
	data.deleteRAMPage(page);
}

function deletePageFromSWAP(page){
	data.deleteSWAPPage(page);
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
function updateStatistics(){
    setFreeRam(statsObj.freeRam);
    setPagePoolStat(statsObj.pagePool);
    setPageHitStat(statsObj.pageHits);
    setPageFaultStat(statsObj.pageFaults);
}
