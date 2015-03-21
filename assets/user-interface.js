$( window ).resize(function() {
  canvas.setWidth($("#canvasrow").width());
});


// Without JQuery
var slider = new Slider('#ex1', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});

// With JQuery
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
	
	
});