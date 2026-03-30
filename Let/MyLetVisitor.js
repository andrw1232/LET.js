// custom classes
import * as Env from './Env.js';
import expval from './Datatypes.js';
// default antlr class to extend
import LetVisitor from './ANTLRParser/LetVisitor.js';


export default class MyLetVisitor extends LetVisitor {
    
    constructor() {
        super();
        this.env = Env.emptyEnv();
        this.env = Env.extendEnv("x", expval.numval(10),this.env);
        this.env = Env.extendEnv("v", expval.numval(5),this.env);
        this.env = Env.extendEnv("i", expval.numval(1),this.env);
    }

    // START
    visitStart(ctx) {
        // console.log("start");
        // console.log(ctx.getPayload());
        // console.log(ctx.children[0].getText());
        return this.visitChildren(ctx)[0].val;
    }


    // NUM
    visitConst(ctx) {
        //console.log("const");

        try {
            var numval = Number.parseFloat(ctx.getText());
            return expval.numval(numval);
        } catch (error) {
            throw new Error("Invalid number");
        }

    }


    // DIFF
    visitDiff(ctx) {
        // console.log("diff");
        var left = (this.visit(ctx.children[2]));
        var right = (this.visit(ctx.children[4]));
        //console.log("left:"+left+"   right: "+right);
        if (expval.isNum(left) && expval.isNum(right)) {
            return expval.numval(left.val-right.val);
        } else {
            throw new Error("Non number value to diff exp");
        }
        
    }


    // ZERO?
    visitZero(ctx) {
        // console.log("zero?");
        if (expval.numEqual(this.visit(ctx.children[2]), expval.numval(0))) {
            return expval.boolval(true);
        }
        return expval.boolval(false);
    }


    // IF ELSE THEN
    visitIf(ctx) {
        // console.log("if");
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
        // console.log("var");
        return Env.applyEnv(this.env, ctx.getText());
    }


    // LET
    visitLet(ctx) {

        // console.log("let");
        const localEnv = this.env;
        this.env = Env.extendEnv(ctx.children[1].getText(), this.visit(ctx.children[3]), localEnv);

        return this.visit(ctx.children[5]);
    }

}
