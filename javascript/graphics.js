var visualConfig = {};

function initVisualConfig() {
    console.log('Initializing visual config...');
    visualConfig = {
        cpuWidth : 100,
        cpuHeight : 100,
        cpuOffsetX : 50,
        
        ramWidth : 200,
        ramWidth : 200,
        ramHeight : 200,
        ramOffsetX : 350,
        frameBorderWidth : 1,
    };
    
    visualConfig.cpuOffsetY = canvas.getHeight() / 2 - visualConfig.cpuHeight / 2;
    visualConfig.ramOffsetY = canvas.getHeight() / 2 - visualConfig.ramHeight / 2;
}

function drawCPU(){
    if (visualObjects.CPU == undefined) {
        var CPU = new fabric.Rect({
            left: visualConfig.cpuOffsetX,
            top:  visualConfig.cpuOffsetY,
            width:  visualConfig.cpuWidth,
            height: visualConfig.cpuHeight,
            fill: '#444444',
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
            fill: '#999999',
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
        var pfWidth = 200;
        var pfHeight = 350;
        var pfOffsetX = 700;
        var pfOffsetY = canvas.getHeight() / 2 - pfHeight / 2;
        
        var Pagefile = new fabric.Rect({
            left: pfOffsetX,
            top:  pfOffsetY,
            width:  pfWidth,
            height: pfHeight,
            fill: '#bbbbbb',
        });
        
        var pfText = new fabric.Text('SWAP', {
            left: pfOffsetX,
            top:  pfOffsetY,
            width:  pfWidth,
            height: pfHeight,
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
                    stroke: '#ff0000',
                });
                
                frame.selectable = false;
                
                canvas.add(frame);
                
                visualObjects.memorySlots.push(frame);
            }
        }
    }
}