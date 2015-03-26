startbtn = $("#start");
pausebtn = $("#pause");
stopbutn = $("#stop");
resetbtn = $("#reset");
fuckoffbtn = undefined;

$( window ).resize(function() {
  canvas.setWidth($("#canvasrow").width());
});

$(".algo-link").click(function(){	
	$("#algoinput").val($(this).attr("data-algo"));
	$(".algo-text").text($(this).html());
});
$(".reset-all").click(function(){
//Reset All UI;

});

startbtn.click(function(){

    var params = {
    if (params.virtMemSize < params.ramSize){
        alert("Virtual memory must be same or bigger then RAM!!!@#$%^!");
        return;
    }
    console.log("StartingAlgo:",params);
	startAlgo(params);
    startbtn.hide();
    pausebtn.attr("data-started",1);
    pausebtn.show();
    disableGUI();
});

stopbutn.click(function(){
	stopAlgo();
    startbtn.show();
    pausebtn.hide();
    pausebtn.attr("data-started",0);
    enableGUI();
});
pausebtn.click(function(){
   if ($(this).attr("data-started") == 1) {
       pauseAlgo();
       $(this).attr("data-started", 0);
       $(this).children().first().first().text("Unpause");
       console.log("PAUSED");
   } else {
       unpauseAlgo();
       $(this).attr("data-started", 1);
       $(this).children().first().first().text("Pause");
       console.log("UNPAUSED");
   }
});
resetbtn.click(function(){
	resetSimulation();
    pausebtn.hide();
    resetGUI();
});

// Speed Slider
$("#ex1").slider();
$("#ex1").on("slide", function(slideEvt) {
	speed = slideEvt.value;
	if (speed < 1){
		speed = 1/Math.pow(2,Math.abs(speed-1));
	}
	$("#ex1SliderVal").text(speed+"X");
	$("#speedinput").val(speed);
	$("#speed").val(speed);
});

function resetGUI(){

};
function enableGUI(){

}
function disableGUI(){

}

// Ram size Slider
$("#ex6").slider();
$("#ex6").on("slide", function(slideEvt) {
    var ramsliderVal = slideEvt.value;
    var virtmemslider = $("#ex8");//.attr("data-slider-value");
    //virtmemsize
    console.log("ram > virt", ramsliderVal + " > " + virtmemslider.val());
    //if (ramsliderVal > virtmemslider.attr("data-slider-value")){
    //    virtmemslider.attr("data-slider-value", ramsliderVal);
    //    virtmemslider.attr("data-slider-min", ramsliderVal);
    //    $("#ex8").slider().destroy().slider();
    //} else {
    //    virtmemslider.attr("data-slider-min", ramsliderVal);
    //}

    var ram = Math.pow(2, slideEvt.value); //KB;
	$('#ramsize').val(ram);	
	var label = " KB";
	if (ram > 2048){
		label = " MB";
		ram = ram/1024;
	}; // Now we MB
	if (ram > 2048){
		label = " GB";
		ram = ram/1024;
	}; // Now we GB;
	$("#ex6SliderVal").text(ram+label);		
	
	console.log($('#ramsize').val() +" div " + $('#framesize').val());
	var framecount = $('#ramsize').val() / $('#framesize').val();	
	console.log("framecount: ",framecount);
	$("#framecount").val(framecount);
	$(".framecount-label").text(framecount);
	
	console.log($("#framecount").val());
});

//Frame size slider
$("#ex7").slider();
$("#ex7").on("slide", function(slideEvt) {
    var ram = Math.pow(2, slideEvt.value); //KB;
	$('#framesize').val(ram);	
	var label = " KB";
	if (ram > 2048){
		label = " MB";
		ram = ram/1024;
	}; // Now we MB
	if (ram > 2048){
		label = " GB";
		ram = ram/1024;
	}; // Now we GB;
	$("#ex7SliderVal").text(ram+label);		
	
	console.log($('#ramsize').val() +" div " + $('#framesize').val());
	var framecount = $('#ramsize').val() / $('#framesize').val();	
	console.log("framecount: ",framecount);
	$("#framecount").val(framecount);
	$(".framecount-label").text(framecount);
	
	console.log($("#framecount").val());
});


//Virtualmem size slider
$("#ex8").slider();
$("#ex8").on("slide", function(slideEvt) {
    var ram = Math.pow(2, slideEvt.value); //KB;
    $('#virtmemsize').val(ram);
    var label = " KB";
    if (ram > 2048){
        label = " MB";
        ram = ram/1024;
    }; // Now we MB
    if (ram > 2048){
        label = " GB";
        ram = ram/1024;
    }; // Now we GB;
    $("#ex8SliderVal").text(ram+label);

    $("#virtmemsize").val(ram);
    $(".virtmemsize-label").text(label);
});

//Swap size slider
$("#ex9").slider();
$("#ex9").on("slide", function(slideEvt) {
    var ram = Math.pow(2, slideEvt.value); //KB;
    $('#swapsize').val(ram);
    var label = " KB";
    if (ram > 2048){
        label = " MB";
        ram = ram/1024;
    }; // Now we MB
    if (ram > 2048){
        label = " GB";
        ram = ram/1024;
    }; // Now we GB;
    $("#ex9SliderVal").text(ram+label);

    $("#swapsize").val(ram);
    $(".swapsize-label").text(label);
});
