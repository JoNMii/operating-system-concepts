var visualConfig = {};

function initVisualConfig() {
    visualConfig = {
        cpuWidth : 100,
        cpuHeight : 100,
        cpuOffsetX : 50,
        
        ramWidth : 200,
        ramHeight : 350,
        ramOffsetX : 350,
		
		pfWidth : 200,
		pfHeight : 380,
		pfOffsetX : 700,
		
        frameBorderWidth : 1,
		
		cpuColor : '#dddddd',
		memoryColor : '#dddddd',
		pagefileColor : '#dddddd',
		
		freePageColor : '#cccccc',
		loadedPageColor : '#777777',
		
		memorySlotBorderColor : '#ff0000',
		pagefileSlotBorderColor : '#ffff00',
    };
    
	// Align vertically
    visualConfig.cpuOffsetY = canvas.getHeight() / 2 - visualConfig.cpuHeight / 2;
    visualConfig.ramOffsetY = canvas.getHeight() / 2 - visualConfig.ramHeight / 2;
	visualConfig.pfOffsetY = canvas.getHeight() / 2 - visualConfig.pfHeight / 2;
}

function drawCPU(){
    if (visualObjects.CPU == undefined) {
        var CPU = new fabric.Rect({
            left: visualConfig.cpuOffsetX,
            top:  visualConfig.cpuOffsetY,
            width:  visualConfig.cpuWidth,
            height: visualConfig.cpuHeight,
            fill: visualConfig.cpuColor,
        });
        
        var cpuText = new fabric.Text('CPU', {
            left: visualConfig.cpuOffsetX,
            top:  visualConfig.cpuOffsetY,
            width: visualConfig.cpuWidth,
            height: visualConfig.cpuHeight,
            textAlign: 'center',
        });
        
        visualObjects.CPU = CPU;
        visualObjects.cpuText = cpuText;
        
        CPU.selectable = false;
        cpuText.selectable = false;
        
        canvas.add(CPU);
        canvas.add(cpuText);
    }
}

function drawMemory() {
    if (visualObjects.RAM == undefined) {
        var RAM = new fabric.Rect({
            left: visualConfig.ramOffsetX,
            top:  visualConfig.ramOffsetY,
            width:  visualConfig.ramWidth,
            height: visualConfig.ramHeight,
            fill: visualConfig.memoryColor,
        });
        
        var ramText = new fabric.Text('RAM', {
            left: visualConfig.ramOffsetX,
            top:  visualConfig.ramOffsetY,
            width:  visualConfig.ramWidth,
            height: visualConfig.ramHeight,
            textAlign: 'center',
        });
        
        visualObjects.RAM = RAM;
        visualObjects.ramText = ramText;
        
        RAM.selectable = false;
        ramText.selectable = false;
        
        canvas.add(RAM);
        canvas.add(ramText);
    }
}

function drawPagefile(){
    if (visualObjects.Pagefile == undefined) {
        var Pagefile = new fabric.Rect({
            left: visualConfig.pfOffsetX,
            top:  visualConfig.pfOffsetY,
            width:  visualConfig.pfWidth,
            height: visualConfig.pfHeight,
            fill: visualConfig.pagefileColor,
        });
        
        var pfText = new fabric.Text('SWAP', {
            left: visualConfig.pfOffsetX,
            top:  visualConfig.pfOffsetY,
            width:  visualConfig.pfWidth,
            height: visualConfig.pfHeight,
            textAlign: 'center',
        });
        
        visualObjects.Pagefile = Pagefile;
        visualObjects.pfText = pfText;
        
        Pagefile.selectable = false;
        pfText.selectable = false;
        
        canvas.add(Pagefile);
        canvas.add(pfText);
    }
}

function drawMemorySlots() {
    if (visualObjects.memorySlots == undefined) {
        var frameCount = pageSlotsInRAM();
        if (frameCount > 0) {
            visualObjects.memorySlots = [];
            
            for (var i = 0; i < frameCount; i++) {
                var x = visualConfig.ramOffsetX;
                var y = visualConfig.ramOffsetY + Math.floor(i * visualConfig.ramHeight / frameCount);
                var w = visualConfig.ramWidth - visualConfig.frameBorderWidth;
                var h = Math.floor((i + 1) * visualConfig.ramHeight / frameCount) - Math.floor(i * visualConfig.ramHeight / frameCount) - visualConfig.frameBorderWidth;
                
                //console.log('Drawing rect ' + x + ' ' + y + ' ' + w  + ' ' + h);
                
                var frame = new fabric.Rect({
                    left: x,
                    top:  y,
                    width:  w,
                    height: h,
                    fill: 'transparent',
                    strokeWidth: visualConfig.frameBorderWidth,
                    stroke: visualConfig.memorySlotBorderColor,
                });
                
                frame.selectable = false;
                
                canvas.add(frame);
                
                visualObjects.memorySlots.push(frame);
            }
        }
    }
}

function drawPagefileSlots() {
    if (visualObjects.pagefileSlots == undefined) {
        var frameCount = pageSlotsInSWAP();
		// console.log('Pagefile frame count: ' + frameCount);
        if (frameCount > 0) {
            visualObjects.pagefileSlots = [];
            
            for (var i = 0; i < frameCount; i++) {
                var x = visualConfig.pfOffsetX;
                var y = visualConfig.pfOffsetY + Math.floor(i * visualConfig.pfHeight / frameCount);
                var w = visualConfig.pfWidth - visualConfig.frameBorderWidth;
                var h = Math.floor((i + 1) * visualConfig.pfHeight / frameCount) - Math.floor(i * visualConfig.pfHeight / frameCount) - visualConfig.frameBorderWidth;
                
                var frame = new fabric.Rect({
                    left: x,
                    top:  y,
                    width:  w,
                    height: h,
                    fill: 'transparent',
                    strokeWidth: visualConfig.frameBorderWidth,
                    stroke: visualConfig.pagefileSlotBorderColor,
                });
                
                frame.selectable = false;
                
                canvas.add(frame);
                
                visualObjects.pagefileSlots.push(frame);
            }
        }
    }
}