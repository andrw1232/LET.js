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

        const localEnv = this.env;
        this.env = Env.extendEnv(ctx.children[1].getText(), this.visit(ctx.children[3]), localEnv);

        return this.visit(ctx.children[5]);
    }

}
