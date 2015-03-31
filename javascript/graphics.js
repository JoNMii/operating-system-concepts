var visualConfig = {};
var visualObjects = { // Handlers for main graphical objects (CPU / Memory / Pagefile / etc.)
    memorySlots : {},
    pagefileSlots : {}
};

var Graphics = {
    MemorySlot : fabric.util.createClass(fabric.Rect, {
        initialize : function (position) {
            var x, y, w, h;
            var frameCount = pageSlotsInRAM();
            x = Graphics.MemorySlot.calculateOffsetX(position);
            y = Graphics.MemorySlot.calculateOffsetY(position);
            w = visualConfig.ramWidth - visualConfig.frameBorderWidth;
            h = Math.floor((position + 1) * visualConfig.ramHeight / frameCount) - Math.floor(position * visualConfig.ramHeight / frameCount) - visualConfig.frameBorderWidth;

            this.left = x;
            this.top = y;
            this.width = w;
            this.height = h;
            this.fill = 'transparent';
            this.strokeWidth = visualConfig.frameBorderWidth;
            this.stroke = visualConfig.memorySlotBorderColor;

            this.selectable = false;
        }
    }),
    PagefileSlot : fabric.util.createClass(fabric.Rect, {
        initialize : function (position) {
            var x, y, w, h;
            var frameCount = pageSlotsInSWAP();
            x = Graphics.PagefileSlot.calculateOffsetX(position);
            y = Graphics.PagefileSlot.calculateOffsetY(position);
            w = visualConfig.pfWidth - visualConfig.frameBorderWidth;
            h = Math.floor((position + 1) * visualConfig.pfHeight / frameCount) - Math.floor(position * visualConfig.pfHeight / frameCount) - visualConfig.frameBorderWidth;

            this.left = x;
            this.top = y;
            this.width = w;
            this.height = h;
            this.fill = 'transparent';
            this.strokeWidth = visualConfig.frameBorderWidth;
            this.stroke = visualConfig.memorySlotBorderColor;

            this.selectable = false;
        }
    }),
    CPU : fabric.util.createClass(fabric.Rect, {
        initialize: function () {
            this.left = visualConfig.cpuOffsetX;
            this.top = visualConfig.cpuOffsetY;
            this.width = visualConfig.cpuWidth;
            this.height = visualConfig.cpuHeight;
            this.fill = visualConfig.cpuColor;
        }
    }),
    RAM : fabric.util.createClass(fabric.Rect, {
        initialize: function () {
            this.left = visualConfig.ramOffsetX;
            this.top =  visualConfig.ramOffsetY;
            this.width =  visualConfig.ramWidth;
            this.height = visualConfig.ramHeight;
            this.fill = visualConfig.memoryColor;
        }
    }),
    SWAP : fabric.util.createClass(fabric.Rect, {
        initialize: function () {
            this.left = visualConfig.pfOffsetX;
            this.top = visualConfig.pfOffsetY;
            this.width = visualConfig.pfWidth;
            this.height = visualConfig.pfHeight;
            this.fill = visualConfig.pagefileColor;
        }
    }),

    drawingEventQueue : []
};

Graphics.MemorySlot.calculateOffsetX = function (position) {
    return visualConfig.ramOffsetX;
};

Graphics.MemorySlot.calculateOffsetY = function (position) {
    return visualConfig.ramOffsetY + Math.floor(position * visualConfig.ramHeight / pageSlotsInRAM());
};

Graphics.PagefileSlot.calculateOffsetX = function (position) {
    return visualConfig.pfOffsetX;
};

Graphics.PagefileSlot.calculateOffsetY = function (position) {
    return visualConfig.pfOffsetY + Math.floor(position * visualConfig.pfHeight / pageSlotsInSWAP());
};

Graphics.enqueueDrawingEvent = function(callback) {
    this.drawingEventQueue.push(callback);
};

Graphics.processDrawingEventQueue = function () {
    var eventsToProcess = this.drawingEventQueue.length;
    while (eventsToProcess--> 0) {
        var callback = this.drawingEventQueue[0];

        if (Date.now() < config.waitUntilTimeStamp) {
            // Stop processing for now
            return;
        } else {
            // Process right now
            console.log('Processing drawingEvent ' + " -> " + callback);
            callback();
        }

        this.drawingEventQueue.shift();
    }
};

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
		pagefileSlotBorderColor : '#ffff00'
    };
    
	// Align vertically
    visualConfig.cpuOffsetY = canvas.getHeight() / 2 - visualConfig.cpuHeight / 2;
    visualConfig.ramOffsetY = canvas.getHeight() / 2 - visualConfig.ramHeight / 2;
	visualConfig.pfOffsetY = canvas.getHeight() / 2 - visualConfig.pfHeight / 2;
}

function clearGraphics() {
    visualObjects = {};
    visualObjects.memorySlots = {};
    visualObjects.pagefileSlots = {};
    canvas.clear();
}

// Redraw / revalidate the visuals
function updateGraphics() {
    drawCPU();
    drawMemory();
    drawPagefile();
    //drawMemorySlots();
    //drawPagefileSlots();

    Graphics.processDrawingEventQueue();

    canvas.renderAll();
}

function drawCPU(){
    if (visualObjects.CPU === undefined) {
        var CPU = new Graphics.CPU();
        
        var cpuText = new fabric.Text('CPU', {
            left: visualConfig.cpuOffsetX,
            top:  visualConfig.cpuOffsetY,
            width: visualConfig.cpuWidth,
            height: visualConfig.cpuHeight,
            textAlign: 'center'
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
    if (visualObjects.RAM === undefined) {
        var RAM = new Graphics.RAM();
        
        var ramText = new fabric.Text('RAM', {
            left: visualConfig.ramOffsetX,
            top:  visualConfig.ramOffsetY,
            width:  visualConfig.ramWidth,
            height: visualConfig.ramHeight,
            textAlign: 'center'
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
    if (visualObjects.Pagefile === undefined) {
        var Pagefile = new Graphics.SWAP();
        
        var pfText = new fabric.Text('SWAP', {
            left: visualConfig.pfOffsetX,
            top:  visualConfig.pfOffsetY,
            width:  visualConfig.pfWidth,
            height: visualConfig.pfHeight,
            textAlign: 'center'
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
    if (visualObjects.memorySlots === undefined) {
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
                    stroke: visualConfig.memorySlotBorderColor
                });
                
                frame.selectable = false;
                
                canvas.add(frame);
                
                visualObjects.memorySlots.push(frame);
            }
        }
    }
}

function drawPagefileSlots() {
    if (visualObjects.pagefileSlots === undefined) {
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
                    stroke: visualConfig.pagefileSlotBorderColor
                });

                frame.selectable = false;

                canvas.add(frame);

                visualObjects.pagefileSlots.push(frame);
            }
        }
    }
}

function getAnimationDuration() {
    // TODO: calculate from config.speed
    return 600;
}

function animateCreatePage(ramSlot) {
    console.assert(!(ramSlot in visualObjects.memorySlots), "Error: memory slot already occupied! Trying to overwrite slot " + ramSlot);

    var slot = new Graphics.MemorySlot(ramSlot);
    console.log('New slot created: ', ramSlot, slot);
    visualObjects.memorySlots[ramSlot] = slot;
    canvas.add(slot);
    canvas.renderAll();
}

function animatePageHit() {
    // TODO: implement something like a 'bounce'
}

// TODO: implement
function animateInterchange(memorySlot, pagefileSlot) {
    console.log('Swapping ' + memorySlot + ' <--> ' + pagefileSlot);

    console.assert(memorySlot in visualObjects.memorySlots, "Error: empty memory slot while swapping -> " + memorySlot);
    console.assert(pagefileSlot in visualObjects.pagefileSlots, "Error: empty pagefile slot while swapping -> " + pagefileSlot);

    var memoryX = visualObjects.memorySlots[memorySlot].left;
    var memoryY = visualObjects.memorySlots[memorySlot].top;
    var pagefileX = visualObjects.pagefileSlots[pagefileSlot].left;
    var pagefileY = visualObjects.pagefileSlots[pagefileSlot].top;

    visualObjects.memorySlots[memorySlot].animate({
            left : pagefileX,
            top : pagefileY
        }, {
            duration: getAnimationDuration(),
            onChange : canvas.renderAll.bind(canvas)
            //onStart : console.log('Animation started! TODO: consider pausing the algorithm'),
            //onComplete : console.log('Animation completed! TODO: consider unpausing the algorithm')
        }
    );

    visualObjects.pagefileSlots[pagefileSlot].animate({
            left : memoryX,
            top : memoryY
        }, {
            duration: getAnimationDuration(),
            onChange : canvas.renderAll.bind(canvas)
            //onStart : console.log('Animation started! TODO: consider pausing the algorithm'),
            //onComplete : console.log('Animation completed! TODO: consider unpausing the algorithm')
        }
    );

    // TODO: perhaps the following code is unnecessary
    //visualObjects.memorySlots[memorySlot] = new Graphics.MemorySlot(memorySlot);
    //visualObjects.pagefileSlots[pagefileSlot] = new Graphics.PagefileSlot(pagefileSlot);
}

function animateRamToSwap(memorySlot, pagefileSlot) {
    console.log('Animating RAM to SWAP ' + memorySlot + ' --> ' + pagefileSlot);

    console.assert(memorySlot in visualObjects.memorySlots, "Error: slot " + memorySlot + " is not in memory!");
    console.assert(!(pagefileSlot in visualObjects.pagefileSlots), "Error: slot " + pagefileSlot + " in pagefile already occupied!");

    var toX = Graphics.PagefileSlot.calculateOffsetX(pagefileSlot);
    var toY = Graphics.PagefileSlot.calculateOffsetY(pagefileSlot);
    var toWidth = visualConfig.pfWidth;
    var toHeight = Graphics.PagefileSlot.calculateOffsetY(pagefileSlot + 1) - toY;

    console.log('Pausing algorithm during animation: animateRamToSwap()...');
    sleep(); // Sleep infinitely - rely on onComplete() event to awaken

    visualObjects.memorySlots[memorySlot].animate({
            left : toX,
            top : toY,
            width : toWidth,
            height : toHeight
        }, {
            duration: getAnimationDuration(),
            onChange : canvas.renderAll.bind(canvas),
            onComplete : function () {
                canvas.remove(visualObjects.memorySlots[memorySlot]);
                console.log('DELETING MEMORY SLOT ' + memorySlot);
                delete visualObjects.memorySlots[memorySlot];

                visualObjects.pagefileSlots[pagefileSlot] = new Graphics.PagefileSlot(pagefileSlot);
                canvas.add(visualObjects.pagefileSlots[pagefileSlot]);
                canvas.renderAll();

                awaken(); // Resume normal execution
            }
        }
    );
}