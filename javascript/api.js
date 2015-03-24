/*
CPU+RAM+Swap file
*/
function startAlgo(algo, ramSize, frameSize, frameCount, speed){
console.log("Simulation started:",{"algo":algo, "ramSize":ramSize, "frameSize":frameSize, "frameCount":frameCount, "speed":speed});

config.ramSize = ramSize
config.frameSize = frameSize
config.frameCount = frameCount
config.speed = speed
config.algo = exampleAlgorythm

if (algo == 0){ //FIFO/FCSF

} else if (algo == 1){ //Second-chance

} else if (algo == 2){ //LRU
	config.algo = LRU_Algorithm
} else if (algo == 3){ //LFU

} else if (algo == 4){ //Random
	config.algo = randomAlgorithm
}	

var init = config.algo.init
if(init && !config.initialised){
 init();
 config.initialised = true;
}

setStep(speed);
};

function setStep(speed){
	config.speed = speed;
	unpause();
}

function pauseAlgo(){
	var timer = config.timer;
	clearInterval(timer);
	delete config.timer;
}

function unpauseAlgo(){
	//timer already started
	if(config.timer){
		pause();
	}
	var step = 1000/config.speed;
	config.timer = setInterval(function(){simulationTick()},step);
}

function stopAlgo(){
	pause();
	config.initialised = false;
	data.clear();
}

var config = {}

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
	
}

function generateEvent(){
    // Random: 50/50
    var requestType = Math.floor(2 * Math.random()) ? "read" : "write";
    // Random address from 0 to RAM_size - 1
    var address = Math.floor(config.ramSize * Math.random());
    
    var request = {
        "type" : requestType,
        "address" : address,
        /* "data" : TODO: if necessary */
    };
    
	return request;
}

function updateGraphics(){
	//redraw/revalidate the visuals
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

function getFreeRamSlot(){
	var usedSlots = getPagesInRAM().keys();
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
	return 1024;
}

function getFreeSWAPSlot(){
	var usedSlots = getPagesInSWAP().keys();
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

//swapout
function writePageToSwap(page,swapSlot){
	if(0<=swapSlot && swapSlot<pageSlotsInSWAP()){
		data.in_swap[swapSlot]=page;
	}
}

//swapin
function writePageToRAM(page,ramSlot){
	if(0<=ramSlot && ramSlot<pageSlotsInRAM()){
		data.in_ram[ramSlot]=page;
	}
}

function findRAMPageById(id){
	var pages = getPagesInRAM();
	for(i in pages){
		if(pageId(pages[i])==id){
			return i;
		}
	}
	return -1;
}

function findSWAPPageById(id){
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
