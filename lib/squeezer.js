var _ = require("underscore");
var util = require("util");


module.exports = function squeezer(){
  return function(obj, path, callback){
		var pathArray = path.split(".");
    var result;
    //start iterating
    if(!callback) {
      callback = function(err, item){
        if(err){
          throw err;
        }
        result = item;
      }
    }
    step(obj, pathArray, callback);
    
    if(result) return result;

    function step(node, ladder,  callback){
      if (!ladder.length > 0) return callback(null, node);
      var next = ladder.shift();
      if(next.indexOf(":")!==-1 && _.isArray(node)){
        if(!_.isArray(node)) return callback(new Error("not an array"));
        var keyPair = next.split(":");
        var next_node = _.find(node, function(item){
          return item[keyPair[0]]==keyPair[1];
        });
        if(!next_node) return callback(new Error("can't find property"));
        return step(next_node, ladder, callback);
      }
      if(!_.isObject(node)) return callback(new Error("not an object"));
      var next_node = node[next];
      return step(next_node, ladder, callback);
    }
	}
}


//mask :
// "form.mega.forms.name:someName.properties.name:somename"
/*var sample = {
  a:[
      {
        b:"10"
      },
      {
        b:13,
        h:[
        {f:12}
          ]
      }
    ]
}

var t = squeezer()(sample,"a.b:13.h.f:12");
t.a=11;


squeezer()(sample, "a.b:10", function(err, item){
  item.a = 12;
  console.log(util.inspect(sample,null,10));
})
*/
//[{a,A}{b,B}{c,C}] = > {a:{a,A},b:{b,B},c:{c,C}};
