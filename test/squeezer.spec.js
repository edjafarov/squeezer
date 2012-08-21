var squeezer = require("../lib/squeezer.js")();
var expect = require("chai").expect;


describe("squeezer will allow you to",function(){
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
	it("refer nested object elements by value of their fields", function(done){
		var sM = squeezer.get(mock, "id:1");
    expect(sM).to.be.ok;
		expect(sM).to.be.an('object');
		expect(sM).to.have.property('msg', 'id1');
    squeezer.get(mock, "id:1", function(err, res){
      expect(res).to.be.ok;
		  expect(res).to.be.an('object');
		  expect(res).to.have.property('msg', 'id1');
      done();
    })
	});

	it("not even id", function(done){
		var sM = squeezer.get(mock, "msg:id1");
		expect(sM).to.be.an('object');
    expect(sM).to.have.property('id', 1);
		squeezer.get(mock, "msg:id1", function(err, res){
  		expect(res).to.be.an('object');
      expect(res).to.have.property('id', 1);
      done();
    })
	});
  it("even deeply nested elements", function(done){
    var sM = squeezer.get(mock, "id:4.arr.id:6");
    expect(sM).to.be.an('object');
    expect(sM).to.have.property('msg', 'another nested');
 		squeezer.get(mock, "id:4.arr.id:6", function(err, res){
  		expect(res).to.be.an('object');
      expect(res).to.have.property('msg', 'another nested');
      done();
    })
  });
  it("and even deeper nested elements", function(done){
    var sM = squeezer.get(mock, "id:4.arr.id:7.deep.id:8");
    expect(sM).to.be.an('object');
    expect(sM).to.have.property('msg', 'deepest object');
    squeezer.get(mock, "id:4.arr.id:7.deep.id:8", function(err, res){
      expect(res).to.be.an('object');
      expect(res).to.have.property('msg', 'deepest object');
      done();
    })
  });
  it("will throw an error if path is wrong", function(done){
    expect(function(){squeezer.get(mock,"id:200")}).to.throw(/can't find property/);
    squeezer.get(mock,"id:200", function(err){
      expect(err.message).to.contain("can't find property");
      done();
    }) 
  });
  it("will throw an error if node is not an object", function(done){
    expect(function(){squeezer.get(mock,"id:4.arr.id.5")}).to.throw(/not an object/);
    squeezer.get(mock,"id:4.arr.id.5", function(err){
      expect(err.message).to.contain("not an object");
      done();
    })
  });
  it("will return true if property found", function(done){
    var sM = squeezer.test(mock, "id:1");
    expect(sM).to.be.ok;
    squeezer.test(mock, "id:1", function(err, res){
      expect(res).to.be.ok;
      done();
    })
  })
  it("will return false if property not found", function(done){
    var sM = squeezer.test(mock, "id:200");
    expect(sM).not.to.be.ok;
    squeezer.test(mock, "id:200", function(err, res){
      expect(res).not.to.be.ok;
      done();
    })
  })
  it("will return array of elements If you will search with regexp", function(done){
    var sM = squeezer.get(mock, "msg:id\\d");
    expect(sM).to.be.an('array');
    expect(sM).to.deep.equal( [ { id: 1, msg: 'id1' },
        { id: 2, msg: 'id2' },
          { id: 3, msg: 'id3' } ]);
    squeezer.get(mock, "msg:id\\d",function(err, res){
      expect(res).to.be.an('array');
      expect(res).to.deep.equal( [ { id: 1, msg: 'id1' },
        { id: 2, msg: 'id2' },
          { id: 3, msg: 'id3' } ]);
      done();
    })
  })
 
  it("will squeeze arrays in complex objects into a hash objects", function(done){
    var sM = squeezer.squeeze(mock, "id.arr.id.deep.id")
    expect(sM[4].arr[7].deep[8].msg).to.equal("deepest object");
    done();
  
  })
})
