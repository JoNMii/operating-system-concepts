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
            if (this.usedId.indexOf(tmp) == -1) {
                this.usedId.push(tmp);
                break;
            };
            tmp += 1;
        };
        return tmp;
    },
    removeId: function(id) {
        this.usedId.pop(id);
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
            deletePage(this.table[i]);
        };
    };
};

function process() {
    this.ttl = -1;
    this.pid = -1;
    this.pageTable = -1;
    this.init = function(pid, pageCount, ttl) {
        this.ttl = ttl;
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
        var timeOfset = getRandomInt(10, 100); //Min 11, max 99 seconds to live
        while (true) {
            if (this.usedPids.indexOf(pid) == -1) {
                tmp.init(pid, getRandomInt(config.pagePerProcessMin, config.pagePerProcessMax), Date.now()+(timeOfset*1000));
                this.usedPids.push(pid);
                break;
            };
            pid += 1;
        };
        this.processList[pid] = tmp;
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
            var event = this.processList[i].makeAction();
            simulationTick(event);
        };        
        
        //Delete old processes
        for (var i in this.processList) {
            if (Date.now() > this.processList[i].ttl) {
                this.processList[i].endProcess();
                console.log("Process ID:"+this.processList[i].pid+" terminated");
                this.usedPids.pop(i);
                delete this.processList[i];
            };
        };
    },
    killAll: function() {
        console.log("Killing all processes");
        for (var i in this.processList) {
            this.processList[i].endProcess();
            console.log("Process ID:"+this.processList[i].pid+" terminated");
            this.usedPids.pop(i);
            delete this.processList[i];            
        };   
        MMU.init(); 
    },
};
