var second-chance_algorithm = {
    "name": "Second Chance",
    "ram_array": var ram_array,
    "init": function(){
        this.ram_array = new Array();
    },
    "find_swap_out_page": function(){
        while(true){
            var page = findRAMPageById(this.ram_array[0]);
            var flags = getFlags(page);
            if (flags.count == 0) {
                return page;
            } else {
                flags.count = 0;
                var page_id = this.ram_array.shift();
                this.ram_array.push(page_id);
                setFlags(page, flags);
            };
        };
    },
    "onEvent": function(event){
        // Read event
        var read = function(address){
            var page_id = addressToPageId(address);
            var page;
            // check if page in ram
            page = findRAMPageById(page_id);
            if (page != -1) {
                var flags = getFlags(page);
                flags.count += 1;
                setFlags(page, flags);
                return;
            };
            // check if page in swap
            page = findSWAPPageById(page_id);
            if (page != -1) {
                //Check if ram available
                var ram_slot = getFreeRAMSlot();
                if (ram_slot != -1) {
                    writePageToRAM(page,ram_slot);
                    return;
                };
                // Find swap out page
                var swap_out_page = this.find_swap_out_page();
                // Swtich them
                
                return;
            };
            // check if new page
            page = createBacklessPage(page_id);
            //Check if ram available
            
            //Check if swap available
            
        };
        
        // Write event
        var write = funcion(address){
            var page_id = addressToPageId(address);
            var page;
            // check if page in ram
            page = ;
            if (page != -1) {
                
                return;
            };
            // check if page in swap
            page = ;
            if (page != -1) {
            
                return;
            };
            // check if new page
            page = createBacklessPage(page_id);
            //Check if ram available
            
            //Check if swap available
            
        };
        
        // Call function for event
        switch(event.type){
            case "read":
                read(event.address);
            case "write":
                write(event.address);
            default:
                throw "Unimplemented event type: " + event.type;
        };
    },
};
