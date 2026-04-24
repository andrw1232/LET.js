// custom classes
import Env from './Env.js'
import expval from './Datatypes.js';
// default antlr class to extend
import LetVisitor from './ANTLRParser/LetVisitor.js';


export default class MyLetVisitor extends LetVisitor {
    
    constructor() {
        super();
        this.env = Env.emptyEnv();
        this.env = Env.extendEnv(["x"], [expval.numVal(10)], this.env);
        this.env = Env.extendEnv(["v"], [expval.numVal(5)], this.env);
        this.env = Env.extendEnv(["i"], [expval.numVal(1)], this.env);
    }

    // START
    visitStart(ctx) {
        return this.visitChildren(ctx)[0].val;
    }


    // NUM
    visitConst(ctx) {
        try {
            var numval = Number.parseFloat(ctx.getText());
            return expval.numVal(numval);
        } catch (error) {
            throw new Error("Invalid number");
        }

    }


    // DIFF
    visitDiff(ctx) {
<<<<<<< HEAD
=======
        // console.log("diff");
>>>>>>> web
        var left = (this.visit(ctx.children[2]));
        var right = (this.visit(ctx.children[4]));

        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numVal(left.val-right.val);
        } else {
            throw new Error("Non number value to diff exp");
        }
        
    }

    // ADD
    visitAddexp(ctx) {
        var left = this.visit(ctx.children[2]);
        var right = this.visit(ctx.children[4]);

        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numVal(left.val + right.val);
        } else {
            throw new Error("Non number value to add exp");
        }
    }

    // MUL
    visitMulexp(ctx) {
        var left = this.visit(ctx.children[2]);
        var right = this.visit(ctx.children[4]);

        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numVal(left.val * right.val);
        } else {
            throw new Error("Non number value to add exp");
        }
    }

    // DIV
    visitDivexp(ctx) {
        var left = this.visit(ctx.children[2]);
        var right = this.visit(ctx.children[4]);
        if (right.val == 0) {
            throw new Error("division by zero");
        }

        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numVal(left.val / right.val);
        } else {
            throw new Error("Non number value to add exp");
        }
    }

    // UNARY MINUS
    visitUnaryminus(ctx) {
        var val = this.visit(ctx.children[2]);
        if (expval.isNum(val)) {
            return expval.numVal(-1 * val.val);
        } else {
            throw new Error("Non number value to unary minus");
        }
    }


    // ZERO?
    visitZero(ctx) {
        if (expval.numEqual(this.visit(ctx.children[2]), expval.numVal(0))) {
            return expval.boolVal(true);
        }
        return expval.boolVal(false);
    }


    // IF ELSE THEN
    visitIf(ctx) {

	    var conditional = this.visit(ctx.children[1]);
        if (expval.isBool(conditional)) { // ensure legal input
            if (conditional.val) { // conditional is true
                return this.visit(ctx.children[3]);
            } else { // conditional is false
                return this.visit(ctx.children[5]);
            }
        } else {
            throw new Error("Non boolean value to if exp");
        }
    }



    // VAR
    visitVar(ctx) {

        return Env.applyEnv(this.env, ctx.getText());
    }


    
    // LET 
    visitLet(ctx) {


        var variableArr = [];
        for (let i = 1; i < ctx.children.length - 4; i = i+3) {
            variableArr.unshift(ctx.children[i].getText());
        }

        var valueArr = [];
        for (let i = 3; i < ctx.children.length - 2; i = i+3) {
           valueArr.unshift(this.visit(ctx.children[i]));
        }


        this.env = Env.extendEnv(variableArr, valueArr, this.env);
        
        return this.visit(ctx.children[ctx.children.length-1]);
    }

}
