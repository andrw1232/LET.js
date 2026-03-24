// node imports
import assert from 'node:assert/strict';
// custom language interpreter
import Interpreter from './Interpreter.js';


function simpleArithmeticTests() {
    try { 
        assert.equal(Interpreter.parse("11"), 11, "positive-const");
        assert.equal(Interpreter.parse("-22"), -22, "negative-const");
        assert.equal(Interpreter.parse("-(44,33)"), 11, "simple-arith-1");
    } catch (err) {
        console.error("Error: "+err);
    }
}

function nestedArithmeticTests() {
    try {
        assert.equal(Interpreter.parse("-(-(44,33),22)"), -11, "nested-arith-left");
        assert.equal(Interpreter.parse("-(55, -(22,11))"), 44, "nested-arith-right");
    } catch(err) {
        console.error("Error: "+err);
    }
}

function simpleVariableTests() {
    try {
        assert.equal(Interpreter.parse("x"), 10, "test-var-1");
        assert.equal(Interpreter.parse("-(x,1)"), 9, "test-var-2");
        assert.equal(Interpreter.parse("-(1,x)"), -9, "test-var-3")
    } catch (error) {
        console.error("Error: "+error);
    }
}

function simpleUnboundVariableTests() {
    try {
        assert.throws(function() { Interpreter.parse("foo"); }, "test-unbound-var-1");
        assert.throws(function() { Interpreter.parse("-(x,foo)"); }, "test-unbound-var-2");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function simpleConditionalTests() {
    try {
        assert.equal(Interpreter.parse("if zero?(0) then 3 else 4"), 3, "if-true");
        assert.equal(Interpreter.parse("if zero?(1) then 3 else 4"), 4, "if-false");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function dynamicTypeCheckingTests() {
    try {
        assert.throws(function() {Interpreter.parse("-(zero?(0),1)")}, "no-bool-to-diff-1");
        assert.throws(function() {Interpreter.parse("-(1,zero?(0))")}, "no-bool-to-diff-2");
        assert.throws(function() {Interpreter.parse("if 1 then 2 else 3")}, "no-int-to-if");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function armsOfIfTests() {
    try {
        assert.equal(Interpreter.parse("if zero?(-(11,11)) then 3 else 4"), 3, "if-eval-test-true");
        assert.equal(Interpreter.parse("if zero?(-(11,12)) then 3 else 4"), 4, "if-eval-test-false");
        assert.equal(Interpreter.parse("if zero?(-(11,11)) then 3 else 0"), 3, "if-eval-test-true-2");
        assert.equal(Interpreter.parse("if zero?(-(11,12)) then 0 else 4"), 4, "if-eval-test-false-2");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}


function simpleLetTests() {
    try {
        assert.equal(Interpreter.parse("let x = 3 in x"), 3, "simple-let-1");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function letBodyRHSEvalTests() {
    try {
        assert.equal(Interpreter.parse("let x = 3 in -(x,1)"), 2, "eval-let-body");
        assert.equal(Interpreter.parse("let x = -(4,1) in -(x,1)"), 2, "eval-let-rhs");
    } catch (error) {
        console.error("Error: "+error.message)
    }
}

function nestedLetTests() {
    try {
        assert.equal(Interpreter.parse("let x = 3 in let y = 4 in -(x,y)"), -1, "simple-nested-let");
        assert.equal(Interpreter.parse("let x = 3 in let x = 4 in x"), 4, "check-shadowing-in-body");
        assert.equal(Interpreter.parse("let x = 3 in let x = -(x,1) in x"), 2, "check-shadowing-in-rhs");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function multipleLetArguments() {
    try {
        assert.equal(Interpreter.parse("let a = 2 b = 3 in -(b,a)"), 1, "multiple-argument-diff");
        assert.equal(Interpreter.parse("let a = -(6,4) b = 3 in -(b,a)"), 1, "multiple-argument-diff-in-1st-arg");
        assert.equal(Interpreter.parse("let a = 2 b = -(7,4) in -(b,a)"), 1, "multiple-argument-diff-in-2nd-arg");
        assert.equal(Interpreter.parse("let a = 2 b = 3 c = 4 in -(c,-(b,a))"), 3, "multiple-argument-diff-in-2nd-arg");
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
simpleLetTests();
letBodyRHSEvalTests();
nestedLetTests();
multipleLetArguments();