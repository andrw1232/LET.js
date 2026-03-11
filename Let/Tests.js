import assert from 'node:assert/strict';
import LetInterpreter from './LetInterpreter.js';




function simpleArithmeticTests() {
    try { 
        assert.equal(LetInterpreter.parse("11"), 11, "positive-const");
        assert.equal(LetInterpreter.parse("-22"), -22, "negative-const");
        assert.equal(LetInterpreter.parse("-(44,33)"), 11, "simple-arith-1");
    } catch (err) {
        console.error("Error: "+err);
    }
}

function nestedArithmeticTests() {
    try {
        assert.equal(LetInterpreter.parse("-(-(44,33),22)"), -11, "nested-arith-left");
        assert.equal(LetInterpreter.parse("-(55, -(22,11))"), 44, "nested-arith-right");
    } catch(err) {
        console.error("Error: "+err);
    }
}

function simpleVariableTests() {
    try {
        assert.equal(LetInterpreter.parse("x"), 10, "test-var-1");
        assert.equal(LetInterpreter.parse("-(x,1)"), 9, "test-var-2");
        assert.equal(LetInterpreter.parse("-(1,x)"), -9, "test-var-3")
    } catch (error) {
        console.error("Error: "+error);
    }
}

function simpleUnboundVariableTests() {
    try {
        assert.throws(function() { LetInterpreter.parse("foo"); }, "test-unbound-var-1");
        assert.throws(function() { LetInterpreter.parse("-(x,foo)"); }, "test-unbound-var-2");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function simpleConditionalTests() {
    try {
        assert.equal(LetInterpreter.parse("if zero?(0) then 3 else 4"), 3, "if-true");
        assert.equal(LetInterpreter.parse("if zero?(1) then 3 else 4"), 4, "if-false");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function dynamicTypeCheckingTests() {
    try {
        assert.throws(function() {LetInterpreter.parse("-(zero?(0),1)")}, "no-bool-to-diff-1");
        assert.throws(function() {LetInterpreter.parse("-(1,zero?(0))")}, "no-bool-to-diff-2");
        assert.throws(function() {LetInterpreter.parse("if 1 then 2 else 3")}, "no-int-to-if");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function armsOfIfTests() {
    try {
        assert.equal(LetInterpreter.parse("if zero?(-(11,11)) then 3 else 4"), 3, "if-eval-test-true");
        assert.equal(LetInterpreter.parse("if zero?(-(11,12)) then 3 else 4"), 4, "if-eval-test-false");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function armsOfIfTests2() {
    try {
        assert.equal(LetInterpreter.parse("if zero?(-(11,11)) then 3 else 0"), 3, "if-eval-test-true-2");
        assert.equal(LetInterpreter.parse("if zero?(-(11,12)) then 0 else 4"), 4, "if-eval-test-false-2");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function simpleLetTests() {
    try {
        assert.equal(LetInterpreter.parse("let x = 3 in x"), 3, "simple-let-1");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function letBodyRHSEvalTests() {
    try {
        assert.equal(LetInterpreter.parse("let x = 3 in -(x,1)"), 2, "eval-let-body");
        assert.equal(LetInterpreter.parse("let x = -(4,1) in -(x,1)"), 2, "eval-let-rhs");
    } catch (error) {
        console.error("Error: "+error.message)
    }
}

function nestedLetTests() {
    try {
        assert.equal(LetInterpreter.parse("let x = 3 in let y = 4 in -(x,y)"), -1, "simple-nested-let")
        assert.equal(LetInterpreter.parse("let x = 3 in let x = 4 in x"), 4, "check-shadowing-in-body")
        assert.equal(LetInterpreter.parse("let x = 3 in let x = -(x,1) in x"), 2, "check-shadowing-in-rhs")
    } catch (error) {
        console.error("Error: "+error.message);
    }
}



simpleArithmeticTests();
nestedArithmeticTests();
simpleVariableTests();
simpleUnboundVariableTests();
simpleConditionalTests();
dynamicTypeCheckingTests();
armsOfIfTests();
armsOfIfTests2();
simpleLetTests();
letBodyRHSEvalTests();
nestedLetTests();