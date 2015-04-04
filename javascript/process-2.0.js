function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var MMU = {
    usedId: [],
    init: function() {
        this.usedId = [];
    },
    getId: function() {
        var tmp = 0;
        while(true) {
            if (!(tmp in this.usedId)) {
                this.usedId += tmp;
                break;
            };
            tmp += 1;
        };
        return tmp;
    },
    removeId: function(id) {
        delete this.usedId[id];
    },
};

function translateTable() {
    this.table = {}; //{pageId: realId}
    this.init = function(pageCount) {
        this.table = {};
        for (var i=0; i< pageCount; i++) {
            this.table[i] = this.allocPage(i);
        };
    };
    this.translate = function(pageId) {
        return this.table[pageId];
    };
    this.setEntry = function(pageId, realId) {
        this.table[pageId] = realId;
    };
    this.allocPage = function(pageId) {
        var tmp = MMU.getId();
        return tmp;
    };
    this.dealloc = function() {
        for (var i in this.table) {
            MMU.removeId(this.table[i]);
        };
    };
};

function process() {
    this.pid = -1;
    this.pageTable = -1;
    this.init = function(pid, pageCount) {
        this.pid = pid;
        this.pageTable = new translateTable();
        this.pageTable.init(pageCount);
    };
    this.makeAction = function() {
        var requestType = Math.floor(2 * Math.random()) ? "read" : "write";
        //TODO: replace address with valid one
        var address = Math.floor(config.virualMemorySize * Math.random());
        var virtual_id = Math.floor(Object.keys(this.pageTable.table).length * Math.random());
        var request = {
		    "pid" : this.pid,
		    "real_id": this.pageTable.translate(virtual_id),
            "type" : requestType,
            "address" : address
        };
	    return request;
    };
    this.endProcess = function() {
        this.pageTable.dealloc();
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
            if (getRandomInt(0,100) % 2 == 0) {
                return;
            };
        };        
        var tmp = new process();
        var pid = 0;
        while (true) {
            if (this.usedPids.indexOf(pid) == -1) {
                tmp.init(pid, getRandomInt(0, 20));
                //TODO: replace values with min/max pages for process
                this.usedPids += pid;
                break;
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
            var event = i.makeAction();
            simulationTick(event);
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
