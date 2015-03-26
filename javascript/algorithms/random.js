var randomAlgorithm = function(){
	var simple = simpleAlgorithm();
	simple.onEvict = function(){
		return Math.floor(Math.random*pageSlotsInRAM());
	}
	simple.name="Random";
	return simple;
}();
