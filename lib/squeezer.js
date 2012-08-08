var _ = require("underscore");
var util = require("util");


module.exports = function squeezer(){
  return {
    get:get,
    test:function(obj, path, callback){
      if (!callback){
        try{
          get(obj, path);
          return true;
        }catch(e){
          return false;
        }
      }else{
        get(obj, path, function(err, res){
          if(err) return callback(null, false);
          callback(null, true);
        })
      }
    }
  }
}

function get(obj, path, callback){
  debugger;  
  var pathArray = path.split(".");
    var result;
    //start iterating
    if(!callback) {
      callback = function(err, item){
        if(err){
          throw err;
        }
        result = item;
        return item;
      }
    }
    step(obj, pathArray, callback);
    
    if(result) return result;

    function step(node, ladder,  callback){
      if (!ladder.length > 0) return callback(null, node);
      var next = ladder.shift();
      if(next.indexOf(":")!==-1 ){
        if(!_.isArray(node)) return callback(new Error( next + " not an array"));
        var keyPair = next.split(":");
        var next_node = _.filter(node, function(item){
          return (new RegExp(keyPair[1])).test(item[keyPair[0]]);
        });
        if(next_node.length === 0) return callback(new Error("can't find property: " + keyPair[1] + " in " + keyPair[0] ));
        if(!_.isArray(next_node)) next_node = [next_node];
        var arr = [];
        var loopError = null;
        _.each(next_node, function(nd){
          step(nd, ladder, function(err, item){
            if(loopError) return false;
            if(err) {
              loopError = true;
              return callback(err)
            };
            arr.push(item);
          })
        })
        if(loopError) return false;

        var flat = _.flatten(arr);
        return callback(null, (flat.length === 1)?flat[0]:flat);
      }
      if(!_.isObject(node)) return callback(new Error( next + " not an object"));
      var next_node = node[next];
      return step(next_node, ladder, callback);
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
//
/*
	var mock = [
		{id:1, msg:"id1"},
    {id:2, msg:"id2"},
    {id:3, msg:"id3"},
    {id:4, arr: [
        {
          id:5,
          msg:"nested object"
        },
        {
          id:6,
          msg:"another nested"
        },
        {
          id:7,
          msg:"deeper nested",
          deep: [
            {
              id:8,
              msg:"deepest object"
            }
          ]
        }
      ]}
	];
	


module.exports().get(mock,"id:4.arr.id.5", function(err){
      debugger;
    })
 */
