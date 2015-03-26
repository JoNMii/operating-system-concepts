function drawCPU(){
    if (visualObjects.CPU == undefined) {
        var cpuWidth = 100;
        var cpuHeight = 100;
        var cpuOffsetX = 50;
        var cpuOffsetY = canvas.getHeight() / 2 - cpuHeight / 2;
        
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
        cpuText.selectable = false;
        
        canvas.add(CPU);
        canvas.add(cpuText);
    }
}

function drawMemory() {
    if (visualObjects.RAM == undefined) {
        var ramWidth = 200;
        var ramHeight = 200;
        var ramOffsetX = 350;
        var ramOffsetY = canvas.getHeight() / 2 - ramHeight / 2;
        
        var RAM = new fabric.Rect({
            left: ramOffsetX,
            top:  ramOffsetY,
            width:  ramWidth,
            height: ramHeight,
            fill: '#999999',
        });
        
        var ramText = new fabric.Text('RAM', {
            left: ramOffsetX,
            top:  ramOffsetY,
            width:  ramWidth,
            height: ramHeight,
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
