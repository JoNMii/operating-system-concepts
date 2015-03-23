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

$("#start").click(function(){
	startAlgo($("#algoinput").val(), $("#ramsize").val(), $("#framesize").val(), $("#framecount").val(), $("#speedinput").val());
});

$("#stop").click(function(){
	stopAlgo();
});

$("#reset").click(function(){
	resetSimulation();
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

// Ram size Slider
$("#ex6").slider();
$("#ex6").on("slide", function(slideEvt) {
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
