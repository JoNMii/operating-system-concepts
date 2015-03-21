/*
CPU+RAM+Swap file
*/

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
	"onTick": function(){}
}

//example/mock implementation.
//replace with actual logic

//increases time by one timeunit
function simulationTick(){
	updateGraphics();
}

//waits ticks timeunits and then runs callback
function runAfter(ticks,callback){
}

function updateGraphics(){
	//redraw/revalidate the visuals
}

function resetSimulation(){
}

function algorythm(){
	return exampleAlgorythm;
}

function generateNewMemRequest(){
	//add new request to pendingMEMRequests
}

function getPendingMEMRequests(){
	return [exampleMEMrequestRead,exampleMEMrequestWrite];
}

function completeMEMRequest(request,pageInRAM){
	//"read" of "write" from the page in RAM
	// delete the request
}

function pageSlotsInRAM(){
	return 2;
}

function getPagesInRAM(){
	// slot_nr:page
	return data.in_ram;
}

function pageSlotsInSWAP(){
	return 30;
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
		var data.in_swap[swapSlot]=page
	}
}

//swapin
function writePageToRAM(page,ramSlot){
	if(0<=ramSlot && ramSlot<pageSlotsInRAM()){
		var data.in_swap[ramSlot]=page
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
		var data.in_swap[ramSlot]=page
	}
}

//create a page but do not assign it any memory
function createBacklessPage(){
	return {
		"page_id":nextPageId()
	};
}

function createPage(ramSlot){
	var page = createBacklessPage();
	assignPage(page,ramSlot);
	return page;
}
