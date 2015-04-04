function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function translateTable() {
    this.table = {}; //{pageId: realId}
    this.init = function(pageCount) {
        this.table = {};
        for (var i=0; i< pageCount; i++) {
            this.table[0] = -1;
        };
    };
    this.translate = function(pageId) {
        return this.table[pageId];
    };
    this.setEntry = function(pageId, realId) {
        this.table[pageId] = realId;
    };
};

function process() {
    this.pid = -1;
    this.pageTable = -1;
    this.init = function(pid) {
        this.pid = pid;
        this.pageTable = new translateTable();
        this.pageTable.init(config.virualMemorySize/config.frameSize);
    };
    this.makeAction = function() {
        var action;
        if (getRandomInt(0,100) % 2 == 0) {
            action = "read";
        } else {
            action = "write";
        };
        //TODO: implement actions
    };
    this.endProcess = function() {
        delete this.pageTable;
    };
};


var processMaster = {
    usedPids: [],
    processList: {}, //{process: [endTime,...]}
    init: function() {
        this.processList = {};
        this.usedPids = [];
    },
    createProcess: function() {
        //If max reached do nothing
        if (Object.keys(this.processList).length == config.processMax) {
            return;
        };
        //50% chance to create new process if min is reached
        if (Object.keys(this.processList).length >= config.processMin) {
            var tmp = getRandomInt(0, 100);
            if (tmp > 50) {
                return;
            };
        };        
        var tmp = new process();
        var pid = 0;
        while (true) {
            if (this.usedPids.indexOf(pid) == -1) {
                tmp.init(pid);
                this.usedPids += pid;
            };
            pid += 1;
        };
        var timeOfset = getRandomInt(10, 100); //Min 11, max 99 seconds to live
        this.processList[tmp] = [Date.now()+(timeOfset*1000)];
        console.log("Process ID:" + pid + " created");
        if (Object.keys(this.processList).length < config.processMin) {
            this.createProcess();
        };
    },
    makeTick: function() {
        //Create new process
        this.createProcess();
        
        //Generate action for each active process
        for (var i in this.processList) {
            i.makeAction();
        };        
        
        //Delete old processes
        for (var i in this.processList) {
            if (Date.now() > this.processList[i][0]) {
                i.endProcess();
                console.log("Process ID:"+i.pid+" terminated");
                delete this.usedPids[i.pid];
                delete this.processList[i];
            };
        };
    },
    killAll: function() {
        console.log("Killing all processes");
        for (var i in this.processList) {
            i.endProcess();
            console.log("Process ID:"+i.pid+" terminated");
            delete this.usedPids[i.pid];
            delete this.processList[i];            
        };    
    },
};
