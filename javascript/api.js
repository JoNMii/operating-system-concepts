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
	"page_id":1
	"min_address":24,
	"max_address":64
}

var examplePage2 ={
	"page_id":2
	"min_address":16,
	"max_address":24
}

var examplePage3 ={
	"page_id":3
	"min_address":64,
	"max_address":72
}

//example/mock implementation.
//replace with actual logic

//Everything that would happen in a single timeunit
function simulationTick(){
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
	return {"0":examplePage,"1":examplePage2};
}

function pageSlotsInSWAP(){
	return 30;
}

function getPagesInSWAP(){
	return {"1":examplePage3};
}

function getAllPages(){
	return [examplePage,examplePage2,examplePage3];
}

// possible flags (use others if needed)
// dirty, valid
// these flags should be included in page table if used

function setFlags(page,flags){
}

function getFlags(page){
	return {"dirty":false};
}

//swapout
function writePageToSwap(page){
}

//swapin
function writePageToRAM(page){
}

//delete from both RAM and SWAP
function deletePage(page){
}

function createPage(){
	return examplePage3;
}
