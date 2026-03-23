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
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function armsOfIfTests2() {
    try {
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
        assert.equal(Interpreter.parse("let x = 3 in let y = 4 in -(x,y)"), -1, "simple-nested-let")
        assert.equal(Interpreter.parse("let x = 3 in let x = 4 in x"), 4, "check-shadowing-in-body")
        assert.equal(Interpreter.parse("let x = 3 in let x = -(x,1) in x"), 2, "check-shadowing-in-rhs")
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function mulTests() {
    try {
        assert.equal(Interpreter.parse("*(3,4)"), 12, "simple-mul");
        assert.equal(Interpreter.parse("*(0,5)"), 0, "mul-by-zero");
        assert.equal(Interpreter.parse("*(5,0)"), 0, "mul-by-zero2");
        assert.equal(Interpreter.parse("*(-(6,3),4)"), 12, "left-exp-eval-mul");
        assert.equal(Interpreter.parse("*(4,-(6,3))"), 12, "right-exp-eval-mul");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function addTests() {
    try {
        assert.equal(Interpreter.parse("+(3,4)"), 7, "simple-add");
        assert.equal(Interpreter.parse("+(-(9,6),4)"), 7, "left-exp-eval-add");
        assert.equal(Interpreter.parse("+(4,-(9,6))"), 7, "right-exp-eval-add");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function divisionTests() {
    try {
        assert.throws(function() {Interpreter.parse("/(5,0)")}, "div-by-zero");
        assert.equal(Interpreter.parse("/(12,3)"), 4, "simple-integer-div");
        assert.equal(Interpreter.parse("/(6,12)"),0.5, "simple-fractional-div");
        assert.equal(Interpreter.parse("/(0,12)"), 0, "zero-div-by-int");
        assert.equal(Interpreter.parse("/(-(9,3),3)"), 2, "left-exp-eval-div");
        assert.equal(Interpreter.parse("/(6,-(9,7))"), 3, "right-exp-eval-div");

    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function unaryMinusTests() {
    try {
        assert.equal(Interpreter.parse("minus(4)"), -4, "simple-unary-minus");
        assert.equal(Interpreter.parse("minus(-(9,5))"), -4, "exp-eval-unary-minus");
        assert.equal(Interpreter.parse("minus(-4)"), 4, "negative-unary-minus");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function equalTests() {
    try {
        assert.equal(Interpreter.parse("equal?(4,4)"), true, "simple-equal-true");
        assert.equal(Interpreter.parse("equal?(5,4)"), false, "simple-equal-false");
        assert.equal(Interpreter.parse("equal?(-(9,3),6)"), true, "equal-left-exp-eval");
        assert.equal(Interpreter.parse("equal?(6,-(9,3))"), true, "equal-right-exp-eval");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function lesserTests() {
    try {
        assert.equal(Interpreter.parse("lesser?(3,4)"), true, "simple-lesser-true");
        assert.equal(Interpreter.parse("lesser?(4,3)"), false, "simple-lesser-false");
        assert.equal(Interpreter.parse("lesser?(-(6,4),8)"), true, "left-exp-eval-lesser");
        assert.equal(Interpreter.parse("lesser?(5,-(9,2))"), true, "right-exp-eval-lesser");
        assert.equal(Interpreter.parse("lesser?(4,4)"), false, "lesser-equal-is-false");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

function greaterTests() {
    try {
        assert.equal(Interpreter.parse("greater?(4,3)"), true, "simple-greater-true");
        assert.equal(Interpreter.parse("greater?(3,4)"), false, "simple-greater-false");
        assert.equal(Interpreter.parse("greater?(-(9,3),4)"), true, "left-exp-eval-greater");
        assert.equal(Interpreter.parse("greater?(4,-(9,2))"), false, "right-exp-eval-greater");
        assert.equal(Interpreter.parse("greater?(4,4)"), false, "greater-equal-is-false");
    } catch (error) {
        console.error("Error: "+error.message);
    }
}

//assert.equal(Interpreter.parse(""), , "");

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
mulTests();
addTests();
divisionTests();
unaryMinusTests();
equalTests();
lesserTests();
greaterTests();