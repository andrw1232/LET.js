// custom classes
import Env from './Env.js';
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
            var numVal = Number.parseFloat(ctx.getText());
            return expval.numVal(numVal);
        } catch (error) {
            console.error("Error: "+error.message);
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

    // ADD
    visitAdd(ctx) {
        var left = this.visit(ctx.children[2]);
        var right = this.visit(ctx.children[4]);

        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numVal(left.val + right.val);
        } else {
            throw new Error("Non number value to add exp");
        }
    }

    // MUL
    visitMul(ctx) {
        var left = this.visit(ctx.children[2]);
        var right = this.visit(ctx.children[4]);

        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numVal(left.val * right.val);
        } else {
            throw new Error("Non number value to add exp");
        }
    }

    // DIV
    visitDiv(ctx) {
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

    // EQUAL?
    visitEqual(ctx) {
        var left = this.visit(ctx.children[2]);
        var right = this.visit(ctx.children[4]);

        if (expval.numEqual(left, right)) {
            return expval.boolVal(true);
        } else if (expval.isBool(left) && expval.isBool(right) && left.val && right.val) {
            return expval.boolean(true);
        }
        return expval.boolVal(false); 
    }

    // GREATER
    visitGreater(ctx) {
        if (this.visit(ctx.children[2]).val > this.visit(ctx.children[4]).val) {
            return expval.boolVal(true);
        }
        return expval.boolVal(false);
    }

    // LESS
    visitLess(ctx) {
        if (this.visit(ctx.children[2]).val < this.visit(ctx.children[4]).val) {
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
        var result = Env.applyEnv(this.env, ctx.getText());
        return result;
    }


    
    // LET 
    visitLet(ctx) {

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

        var boundVars = []; // save all the bound IDs for the arguments in an array
        for (let i = 2; i < ctx.children.length-2; i = i+2) {
            boundVars.push(ctx.children[i].getText());
        }

        var body = ctx.children[ctx.children.length-1]; // save the body but don't visit it yet
        //console.log(boundVars);
        var func = expval.procVal( [boundVars, body, this.env] ); // save them all in a proc value
        return func;
    }


    // CALL
    visitCall(ctx) {
        // console.log("call");

        var rator = this.visit(ctx.children[1]); // the procedure

        var rands = [];
        for (let i = 2; i < ctx.children.length-1; i++) {
            rands.push(this.visit(ctx.children[i]));
        }

        var localEnv = this.env; // save the current local env

        this.env = Env.extendEnv(rator.val[0], rands, rator.val[2]); // save the current environment as the procedures environment with a binding for the argument.
        var result = this.visit(rator.val[1]); // resolve the procedure
        this.env = localEnv;

        return result;   
    }


    // LETREC
    visitLetrec(ctx) {

        // define arrays to extend the env with
        var procNames = [];
        var boundVars = [];
        var procBodies = [];
        

        var procIndex = 1;
        // extract one procedure from the let rec statement per loop
        while (procIndex < ctx.children.length - 2) {

            procNames.push(ctx.children[procIndex].getText());
            procIndex = procIndex + 2; // skip past the mandatory open bracket

            if (ctx.children[procIndex].getText() == ')') {
                procIndex = procIndex + 2; // skip past the closed bracket and '='
            } else {

                var procVars = []; // make an array to hold all of this procedures bound variables

                while(ctx.children[procIndex].getText() != ')') { // loop until we hit the closing brace
                    
                    if(ctx.children[procIndex].getText() != ',') { // add all the variables (everything except commas)
                        procVars.push(ctx.children[procIndex].getText());
                    }
                    procIndex++; // next char within the parenthesis
                }
            }
            procIndex++; // move past the closed parenthesis
            procIndex++; // move past the '='

            boundVars.push(procVars);
            procBodies.push(ctx.children[procIndex]); // add the proc body

            procIndex++; // go to the next proc or 'in'
        }
        

       
        this.env = Env.extendRecEnv(procNames, boundVars, procBodies, this.env);
        

        var result = this.visit(ctx.children[ctx.children.length-1]);

        return result;
    }

}