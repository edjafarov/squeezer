var squeezer = require("../lib/squeezer.js")();
var expect = require("chai").expect;
describe("squeezer will squeeze your array of objects",function(){
	var mock = [
		{id:1, msg:"id1"},{id:2, msg:"id2"},{id:3, msg:"id3"}
	];
	it("like if you want to refer one of properties as a key", function(done){
		var sM = squeezer(mock);
		expect(sM).to.be.ok;
		expect(sM).to.be.an('object');
		
		expect(sM).to.have.deep.property('1.msg', 'id1');
		expect(sM).to.have.deep.property('2.msg', 'id2');
		expect(sM).to.have.deep.property('3.msg', 'id3');
		done();
	});

	it("if you want to refer an id manually", function(done){
		var sM = squeezer(mock, "msg");
		expect(sM).to.have.deep.property('id1.id', 1);
		expect(sM).to.have.deep.property('id2.id', 2);
		expect(sM).to.have.deep.property('id3.id', 3);
		done();
	});
})
