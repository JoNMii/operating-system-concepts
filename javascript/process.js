function process() {
    this.pageList = []; //Pages available for process
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
                this.processList[key].endProcess();
                delete this.processList[key];
            } else {
                this.processList[key].createAction();
            };
        }
    },
    killAll: function() {
    //TODO: implement kill all processes
    },
};


