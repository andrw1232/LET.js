// jshint ignore: start
import antlr4 from 'antlr4';
import * as Env from './Env.js';
import LetVisitor from './LetVisitor.js';
import expval from './Datatypes.js';

// This class defines a complete generic visitor for a parse tree produced by LetParser.

export default class MyLetVisitor extends LetVisitor {
    
    constructor() {
        super();
        this.env = Env.emptyEnv();
        this.env = Env.extendEnv("x", expval.numval(10),this.env);
        this.env = Env.extendEnv("v", expval.numval(5),this.env);
        this.env = Env.extendEnv("i", expval.numval(1),this.env);
    }

    // Visit a parse tree produced by LetParser#start.
    visitStart(ctx) {
        // console.log("start");
        // console.log(ctx.getPayload());
        // console.log(ctx.children[0].getText());
        return this.visitChildren(ctx)[0].val;
    }


    // Visit a parse tree produced by LetParser#const.
    visitConst(ctx) {
        // console.log("const");
        //console.log(Number.parseInt(ctx.getText()));
        return expval.numval(Number.parseInt(ctx.getText()));
    }


    // Visit a parse tree produced by LetParser#diffexp.
    visitDiffexp(ctx) {
        // console.log("diff");
        var left = (this.visit(ctx.children[2]));
        var right = (this.visit(ctx.children[4]));
        //console.log("left:"+left+"   right: "+right);
        return expval.numval(left.val-right.val);
    }


    // Visit a parse tree produced by LetParser#zero.
    visitZero(ctx) {
        // console.log("zero?");
        if (expval.numEqual(this.visit(ctx.children[2]), expval.numval(0))) {
            return expval.boolval(true);
        }
        return expval.boolval(false);
    }


    // Visit a parse tree produced by LetParser#if.
    visitIf(ctx) {
        // console.log("if");

        if (this.visit(ctx.children[1]).val) {
            return this.visit(ctx.children[3]);
        } else {
            return this.visit(ctx.children[5]);
        }
    }



    // Visit a parse tree produced by LetParser#var.
    visitVar(ctx) {
        // console.log("var");
        return Env.applyEnv(this.env, ctx.getText());
    }


    // Visit a parse tree produced by LetParser#let.
    visitLet(ctx) {

        // console.log("let");
        const localEnv = this.env;
        this.env = Env.extendEnv(ctx.children[1].getText(), this.visit(ctx.children[3]), localEnv);

        return this.visit(ctx.children[5]);
    }

}