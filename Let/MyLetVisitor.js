// custom classes
import Env from './Env.js';
import expVal from './Datatypes.js';
// default antlr class to extend
import LetVisitor from './ANTLRParser/LetVisitor.js';


export default class MyLetVisitor extends LetVisitor {
    
    constructor() {
        super();
        this.env = Env.emptyEnv();
        this.env = Env.extendEnv(["x"], [expVal.numVal(10)], this.env);
        this.env = Env.extendEnv(["v"], [expVal.numVal(5)], this.env);
        this.env = Env.extendEnv(["i"], [expVal.numVal(1)], this.env);
    }

    // START
    visitStart(ctx) {
        return this.visitChildren(ctx)[0].val;
    }


    // NUM
    visitConst(ctx) {
        try {
            var numVal = Number.parseFloat(ctx.getText());
            return expVal.numVal(numVal);
        } catch (error) {
            console.error("Error: "+error.message);
        }
    }


    // DIFF
    visitDiff(ctx) {
        var left = (this.visit(ctx.children[2]));
        var right = (this.visit(ctx.children[4]));

        if (expVal.isNum(left) && expVal.isNum(right)) {
            return expVal.numVal(left.val-right.val);
        } else {
            throw new Error("Non number value to diff exp");
        }
        
    }


    // ZERO?
    visitZero(ctx) {
        // compare the number to numval(0)
        if (expVal.numEqual(this.visit(ctx.children[2]), expVal.numVal(0))) {
            return expVal.boolVal(true);
        }
        return expVal.boolVal(false);
    }


    // IF ELSE THEN
    visitIf(ctx) {
	    var conditional = this.visit(ctx.children[1]);

        if (expVal.isBool(conditional)) { // ensure legal input

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
        var result = Env.applyEnv(this.env, ctx.getText());
        return result;
    }


    // LET
    visitLet(ctx) {

        //const localEnv = Env.envCopy(this.env);

        // could write a recursive function for this I suppose? It's just building the list of inputs
        var variableArr = [];
        for (let i = 1; i < ctx.children.length - 4; i = i+3) {
            variableArr.unshift(ctx.children[i].getText());
        }

        var valueArr = [];
        for (let i = 3; i < ctx.children.length - 2; i = i+3) {
           valueArr.unshift(this.visit(ctx.children[i]));
        }
 

        this.env = Env.extendEnv(variableArr, valueArr, this.env);
        
        const result = this.visit(ctx.children[ctx.children.length-1]);
        return result;
    }

    // PROC
    visitProc(ctx) {
        var variable = ctx.children[2].getText(); // get the ID
        var body = ctx.children[4]; // save the body but don't visit it yet
        var func = expVal.procVal( [variable, body, this.env] ); // save them all in a proc value
        return func;
    }


    // CALL
    visitCall(ctx) {

        var rator = this.visit(ctx.children[1]); // the procedure
        var rand = this.visit(ctx.children[2]); // the argument

        //console.log(this.env);

        this.env = Env.extendEnv([rator.val[0]], [rand], rator.val[2]); // save the current environment as the procedures environment with a binding for the argument.
        //console.log(rator);
        //console.log(rand);
        var result = this.visit(rator.val[1]); // resolve the procedure

        return result;   
    }


    // LETREC
    visitLetrec(ctx) {

        //console.log(ctx.getText());

        var procName = ctx.children[1].getText() // proc name
        var boundVar = ctx.children[3].getText() // bound var
        var procBody = ctx.children[6] // proc body
        //ctx.children[8] // letrec body

        this.env = Env.extendRecEnv(procName, boundVar, procBody, this.env);

        //console.log(ctx.children[8].getText());
        var result = this.visit(ctx.children[8]);

        return result;
    }


}
