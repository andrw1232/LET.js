// Generated from Let.g4 by ANTLR 4.9.2
// jshint ignore: start
import antlr4 from 'antlr4';

// This class defines a complete generic visitor for a parse tree produced by LetParser.

export default class LetVisitor extends antlr4.tree.ParseTreeVisitor {



	constCount = 0;


	// Visit a parse tree produced by LetParser#start.
	visitStart(ctx) {
		console.log("start");
	  return this.visitChildren(ctx)[0];
	}


	// Visit a parse tree produced by LetParser#const.
	visitConst(ctx) {
	  console.log("const");
	  this.constCount = this.constCount + 1;
	  console.log(this.constCount);

	  	return Number.parseInt(ctx.INT().getText());
	}


	// Visit a parse tree produced by LetParser#diffexp.
	visitDiffexp(ctx) {
		console.log("diff");
	  return (this.visit(ctx.children[2])) - (this.visit(ctx.children[4]));
	}


	// Visit a parse tree produced by LetParser#zero.
	visitZero(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by LetParser#if.
	visitIf(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by LetParser#var.
	visitVar(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by LetParser#let.
	visitLet(ctx) {
	  return this.visitChildren(ctx);
	}



}