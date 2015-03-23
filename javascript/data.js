//do not modify directly
//only read directly for debug
var data={
	"backless":[],
	"in_ram":{},
	"in_swap":{},
	"flags":{},
"deletePage" : function(page){
	var thisPage = function(item){
		return equalPages(page,item);	
	}

	var keyInSwap = data.in_swap.findKeyFor(thisPage);
	if(keyInSwap != null){
		delete data.in_swap[keyInSwap];
	}

	var keyInRAM = data.in_ram.findKeyFor(thisPage);
	if(keyInRAM != null){
		delete data.in_ram[keyInRAM];
	}

	delete data.flags[pageId(page)];


	data.backless=data.backless.filter(function(item){
		return item.page_id != page.page_id;
	});
},
"clear" : function(){
	data.backless=[];
	data.in_ram={};
	data.in_swap={};
	data.flags={};
}
}

var nextPageIdVal = 1;
function nextPageId(){
	return nextPageIdVal++;
}

function comparePages(page1,page2){
	return page2.page_id - page1.page_id;
}

function equalPages(page1,page2){
	return page2.page_id == page1.page_id;
}

function pageId(page){
	return page.page_id;
}

function findKeyFor(obj,filter_func){
	for (var key in obj) {
		var der = filter_func(key);
		if(der){
			return key;
		}
	}
	return null;
}

Array.prototype.getUniqueBy = function(id_func){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(id_func(this[i]))) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
