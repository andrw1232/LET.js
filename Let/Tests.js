import assert from 'node:assert/strict';
import LetInterpreter from './LetInterpreter.js';




function simpleArithmeticTests() {

    try {
        assert.equal(11, LetInterpreter.parse("11"), "positive-const");


    } catch (err) {
        console.error("Error: "+err.message);
    }

}

simpleArithmeticTests();