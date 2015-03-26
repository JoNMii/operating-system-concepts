var randomAlgorithm = function(){
	var simple = simpleAlgorithm();
	simple.onEvict = function(){
		return Math.random*pageSlotsInRAM();
	}
	return simple;
}();
