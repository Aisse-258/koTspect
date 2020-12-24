var mocha  = require('mocha') ,
assert = require('chai').assert ,
expect = require('chai').expect ;

var divide_side = require('../functions/divide_side.js');

describe("divide_side() -- функция разделения стороны на n частей", function() {

	it("Делить сторону на n равных* частей (остаток от деления присоединяется к последней части)", function() {
		expect(divide_side(10, 3)).to.eql([0,3,6,10]);
		expect(divide_side(10, 4)).to.eql([0,2,4,6,10]);
		expect(divide_side(100, 4)).to.eql([0,25,50,75,100]);
		expect(divide_side(100, 3)).to.eql([0,33,66,100]);
	});

	it("Если кол-во частей больше длины стороны, она остаётся целой", function() {
		expect(divide_side(10, 15)).to.eql([0,10]);
	});

	it("Если кол-во частей дробно, округлить", function() {
		expect(divide_side(10, 3.1)).to.eql([0,3,6,10]);
		expect(divide_side(10, 3.5)).to.eql([0,2,4,6,10]);
	});
	
	it("Если кол-во частей отрицательно, использовать его модуль", function() {
		expect(divide_side(10, -3)).to.eql([0,3,6,10]);
	});

});
