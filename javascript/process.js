function pageToFrame() {
    this.pageTable = {}; //{pageid: [ramSlot, V or I]}
    this.maxPages = 0;
    this.init = function() {
        this.pageTable = {};
        this.maxPages = config.virualMemorySize/config.frameSize;
        for (var i=0; i<this.maxPages; i++) {
            this.pageTable[i] = [-1, "I"]; //All entries invalid
        };
    };
    this.getFrame = function(pageId) {
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
    };
};


function process() {
    this.pid = -1;
    this.table = 0;
    this.pageList = []; //virtual pages available for process
    this.maxPageCount = 0;
    this.createPage = function() {
        //TODO: Implement page creation
    };
    
    this.init = function(pid) {
        this.maxPageCount = Math.floor(Math.random() * 10 * 2);
        for(var i=0; i<this.maxPageCount; i++) {
            this.createPage();
        };
        this.table = new pageToFrame();
        this.table.init();
        this.pid = pid;
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
    usedPids: [],
    processList: {}, //{process: [pid, death]}
    createProcess: function() {
        var pid = 0;
        var tmp;
        while (true) {
            //Find available pid
            if (this.usedPids.indexOf(pid) == -1) {
                tmp = new process(pid);
                this.usedPids += pid;
                break;
            };
            pid += 1;
        };
        tmp.init();
        //Process alive for 15s
        this.processList[tmp] = [pid, new Date().getTime() + (1000 * 15)];
    },
    makeTick: function() {
        if (Object.keys(this.processList).length < 3 || Math.floor(Math.random()*10) > 7) {
            this.createProcess();
        };
        for (key in this.processList) {
            if (this.processList[key][1] < new Date().getTime()) {
                key.endProcess();
                delete this.usedPids[this.processList[key][0]];
                delete this.processList[key];
            } else {
                key.createAction();
            };
        }
    },
    killAll: function() {
        for(var i in this.processList) {
            i.endProcess();
            delete this.usedPids[this.processList[i][0]];
            delete this.processList[i];
        };
    },
};


