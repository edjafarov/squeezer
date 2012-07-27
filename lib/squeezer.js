module.exports = function(){
	return function(array, byProperty){
		byProperty = byProperty || "id";
		var result={};
		array.forEach(function(item){
			result[item[byProperty]] = item;
		});
		return result;
	}
}

//[{a,A}{b,B}{c,C}] = > {a:{a,A},b:{b,B},c:{c,C}};
