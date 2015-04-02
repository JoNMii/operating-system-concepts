var pageToFrame = {
    pageTable: {}, //{pageid: [ramSlot, V or I]}
    maxPages: 0,
    init: function() {
        this.pageTable = {};
        this.maxPages = config.virualMemorySize/config.frameSize;
        for (var i=0; i<this.maxPages; i++) {
            this.pageTable[i] = [-1, "I"]; //All entries invalid
        };
    },
    getFrame: function(pageId) {
        if (pageId >= (this.maxPages) || pageId < 0) {
            console.log("Invalid page id: ",pageId);
            return -1;
        } else if (this.pageTable[pageId][1] == "I") {
            var swapOutSlot = 0; //TODO: change to slot returned by algo
            for (var i=0; i<this.maxPages; i++) {
                if (this.pageTable[i][0] == swapOutSlot) {
                    this.pageTable[i][1] == "I";
                    break;
                };
            };
            this.pageTable[pageId][0] = swapOutSlot;
            this.pageTable[pageId][1] = "V";
            return this.pageTable[pageId][0];
        } else {
            //Page already in Ram, return ramSlot
            return this.pageTable[pageId][0];
        };
    },
};


function process() {
    this.pageList = []; //virtual pages available for process
    this.maxPageCount = 0;
    this.createPage = function() {
        //TODO: Implement page creation
    };
    
    this.init = function() {
        this.maxPageCount = Math.floor(Math.random() * 10 * 2);
        for(var i=0; i<this.maxPageCount; i++) {
            this.createPage();
        };
    };
    this.createAction = function() {
        var action;
        if (Math.floor(Math.random() * 10) % 2 == 0) {
            action = "write";
        } else {
            action = "read";
        };
        //TODO: create request
    };
    this.endProcess = function() {
        //TODO: Implement deletion of pages
    };
};


var processMaster = {
    processList: {},
    createProcess: function() {
        var tmp = new process();
        tmp.init();
        //Process alive for 15s
        this.processList[tmp] = new Date().getTime() + (1000 * 15);
    },
    makeTick: function() {
        if (Object.keys(this.processList).length < 3 || Math.floor(Math.random()*10) > 7) {
            this.createProcess();
        };
        for (key in this.processList) {
            if (this.processList[key] < new Date().getTime()) {
                key.endProcess();
                delete this.processList[key];
            } else {
                key.createAction();
            };
        }
    },
    killAll: function() {
        for(var i in this.processList) {
            i.endProcess();
            delete this.processList[i];
        };
    },
};


