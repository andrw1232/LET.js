import assert from 'node:assert/strict';
import LetInterpreter from './LetInterpreter.js';
import expval from './Datatypes.js';




function simpleArithmeticTests() {
    try { 
        assert.equal(LetInterpreter.parse("11"), 11, "positive-const");
        assert.equal(LetInterpreter.parse("-22"), -22, "negative-const");
        assert.equal(LetInterpreter.parse("-(44,33)"), 11, "simple-arith-1");
    } catch (err) {
        console.error("Error: "+err.message);
    }
}

function nestedArithmeticTests() {
    try {
        assert.equal(LetInterpreter.parse("-(-(44,33),22)"), -11, "nested-arith-left");
        assert.equal(LetInterpreter.parse("-(55, -(22,11))"), 44, "nested-arith-right");
    } catch(err) {
        console.error("Error: "+err.message);
    }
}

simpleArithmeticTests();