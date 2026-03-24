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
        return expval.getPrintableVal(this.visitChildren(ctx)[0]);
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
        var left = (this.visit(ctx.children[2]));
        var right = (this.visit(ctx.children[4]));

        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numVal(left.val-right.val);
        } else {
            throw new Error("Non number value to diff exp");
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

    // PROC
    visitProc(ctx) {
        var variable = ctx.children[2].getText(); // get the ID
        var body = ctx.children[4]; // save the body but don't visit it yet
        var func = expval.procVal( [variable, body, this.env] ); // save them all in a proc value
        return func;
    }


    // CALL
    visitCall(ctx) {

        var rator = this.visit(ctx.children[1]); // the procedure
        var rand = this.visit(ctx.children[2]); // the argument

        var localEnv = this.env; // save the current local env

        this.env = Env.extendEnv([rator.val[0]], [rand], rator.val[2]); // save the current environemtn as the procedures environment with a binding for the argument.
        var result = this.visit(rator.val[1]); // resolve the procedure

        this.env = localEnv; // put the current env back
        return result;
        
    }
}
