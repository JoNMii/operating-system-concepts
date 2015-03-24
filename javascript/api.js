/*
CPU+RAM+Swap file
*/

/*** Global variables ***/
var config = {} // Animation configuration
var visualObjects = {} // Handlers for main graphical objects (CPU / Memory / Pagefile)

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

}	

var init = config.algo.init
if(init && !config.initialised){
 init();
 config.initialised = true;
}

//timer started
if(config.timer){
	stopAlgo();
}
var step = 1000/speed;
config.timer = setInterval(function(){simulationTick()},step);
};

function stopAlgo(){
	var timer = config.timer;
	clearInterval(timer);
	delete config.timer;
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

function drawCPU(){
    if (visualObjects.CPU == undefined) {
        var cpuWidth = 200;
        var cpuHeight = 200;
        var cpuOffsetX = 50;
        var cpuOffsetY = 150;
        
        var CPU = new fabric.Rect({
            left: cpuOffsetX,
            top: cpuOffsetY,
            width: cpuWidth,
            height: cpuHeight,
            fill: '#444444',
        });
        
        var cpuText = new fabric.Text('CPU', {
            left: cpuOffsetX,
            top: cpuOffsetY,
            width: cpuWidth,
            height: cpuHeight,
            textAlign: 'center',
        });
        
        visualObjects.CPU = CPU;
        visualObjects.cpuText = cpuText;
        
        CPU.selectable = false;
        CPU.cpuText = false;
        
        canvas.add(CPU);
        canvas.add(cpuText);
    }
}

function drawMemory(){
}

function drawPagefile(){
}

function updateGraphics(){
	//redraw/revalidate the visuals
    
    drawCPU();
}

function resetSimulation(){
	stopAlgo();
	config.initialised = false;
	data.clear();
}

function algorythm(){
	return config.algo;
}

function pageSlotsInRAM(){
	return config.frameCount;
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

//delete page from both RAM and SWAP
function deletePage(page){
	data.deletePage(page);
}

function assignPage(page,ramSlot){
	// assign the page to a slot on RAM
	//TODO check if not already in ram
	if(0<=ramSlot && ramSlot<pageSlotsInRAM()){
		data.in_swap[ramSlot]=page;
	}
}

//create a page but do not assign it any memory
function createBacklessPage(pageId){
	return {
		"page_id":pageId,
		"min_address":pageId * pageSize(),
		"max_address":(pageId+1) * pageSize()
	};
}

function createPage(ramSlot,pageId){
	var page = createBacklessPage(pageId);
	assignPage(page,ramSlot);
	return page;
}
