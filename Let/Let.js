import antlr4 from 'antlr4';
import LetLexer from './LetLexer.js';
import LetParser from './LetParser.js';
import LetVisitor from './MyLetVisitor.js';
import repl from 'node:repl';
import ErrorLet from './ErrorLet.js';

/** let x = 7
    in let y = 2
    in let y = let x = -(x, 1)
    in -(x, y)
    in -(-(x, 8), y)
*/
// -(7,3)
// -(9,-(5,2))
// zero? ( -(3,3) )
// if zero?(0) then 42 else 19
// let x = 3 in -(7,x)







function parse(inputString, context, replResourceName, callback) {

    try {

        //console.log("input: "+inputString.trim());

        // READING
        const chars = new antlr4.InputStream(inputString);
        const lexer = new LetLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);

        const parser = new LetParser(tokens);
        // parser error handling setup
        parser.removeErrorListeners(); // remove the old
        parser.addErrorListener(new ErrorLet()); // add the new

        var tree;
        try {
            tree = parser.start(); // this prints to the console if the input is incomplete
        } catch (error) {
            //console.log("parse error: "+error);
            return callback(new repl.Recoverable(error));
        }

        const visitor = new LetVisitor();

        try {
            var result = visitor.visitStart(tree);
            callback(null, result);
        } catch (error) {
            //console.log("error visiting: "+error);
            return callback(new repl.Recoverable(error));
        }

    } catch (error) {
        console.log(error);
        callback(new Error('uncaught error'));
    }
}





// make REPL. prompt is the line start character(s). parse is the interpreting function.
const r = repl.start( {prompt: "->", eval: parse} );

// REPL exit message
r.on('exit',() => {
    console.log("Thanks for using LET");
}); 



/**
 * fails to properly continue multi line REPL 
 * Case: zero?( \n
 *       0) \n
 * Expected: true
 * result: 0
 * 
 */

