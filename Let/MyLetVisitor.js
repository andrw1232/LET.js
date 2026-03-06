// jshint ignore: start
import antlr4 from 'antlr4';
import * as Env from './Env.js';
import LetVisitor from './LetVisitor.js';

// This class defines a complete generic visitor for a parse tree produced by LetParser.

export default class MyLetVisitor extends LetVisitor {

    //env;

    constructor() {
        super();
        this.env = Env.emptyEnv();
    }

    // Visit a parse tree produced by LetParser#start.
    visitStart(ctx) {
        // console.log("start");
        // console.log(ctx.getPayload());
        //console.log(ctx.children[0].getText());
        return this.visitChildren(ctx)[0];
    }


    // Visit a parse tree produced by LetParser#const.
    visitConst(ctx) {
        // console.log("const");
        //console.log(Number.parseInt(ctx.getText()));
        return Number.parseInt(ctx.getText());
    }


    // Visit a parse tree produced by LetParser#diffexp.
    visitDiffexp(ctx) {
        // console.log("diff");
        var left = (this.visit(ctx.children[2]));
        var right = (this.visit(ctx.children[4]));
        //console.log("left:"+left+"   right: "+right);
        return left-right;
    }


    // Visit a parse tree produced by LetParser#zero.
    visitZero(ctx) {
        // console.log("zero?");
        if (this.visit(ctx.children[2]) == 0) {
            return true;
        }
        return false;
    }


    // Visit a parse tree produced by LetParser#if.
    visitIf(ctx) {
        // console.log("if");

        if (this.visit(ctx.children[1])) {
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