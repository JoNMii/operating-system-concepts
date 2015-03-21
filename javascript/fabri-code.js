$(function () {
	
		// Obtain a canvas drawing surface from fabric.js
		canvas = new fabric.Canvas('c');
  		canvas.setHeight(400);
		canvas.setWidth($("#canvasrow").width()); //was 800 ;d
		// Create a text object. 
		// Does not display it-the canvas doesn't 
		// know about it yet.
		var hi = new fabric.Text('Derp, world.', {
			left: canvas.getWidth() / 2,
			top: canvas.getHeight() / 2		
		});

		var rect = new fabric.Rect({
			left: 100,
			top: 100,
			fill: 'red',
			width: 20,
			height: 20,
			angle: 45,
		});
	
		// Attach it to the canvas object, then (re)display
		// the canvas.	
		canvas.add(hi, rect);

		function observeNumeric(property) {
		    document.getElementById(property).onchange = function() {
			console.log(this.value);
		      //canvas.renderAll();
		    };
		}
		function observeNumeric2(property) {
		    document.getElementById(property).onchange = function() {
			console.log(document.getElementById('ramsize').value)
		      //canvas.item(1)['angle'] = this.value * 10;
		      //canvas.renderAll();
		    };
		}
		// Get value from speed slider
		observeNumeric('ex1');
		// Get value from ram slider
		observeNumeric2('ex6');
				
	}); 
