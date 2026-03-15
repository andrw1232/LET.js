// node imports
import antlr4 from 'antlr4';
import repl from 'node:repl';
// antlr parser file imports
import LetLexer from './ANTLRParser/LetLexer.js';
import LetParser from './ANTLRParser/LetParser.js';
// custom overridden antlr classes
import CustomError from './CustomError.js';
// language specific custom classes
import Visitor from './MyLetVisitor.js';

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


export default class LetInterpreter {

    // most basic parsing of a string
    static parse(inputData) {

        const chars = new antlr4.InputStream(inputData);
        const lexer = new LetLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new LetParser(tokens);
        const tree = parser.start();
        const visitor = new Visitor();
        // visit the parse tree to get the result
        const result = visitor.visitStart(tree);
        return result;

    }


    // parsing for the read eval print loop
    static parseREPL(inputString, context, replResourceName, callback) {

        try {

            // READING
            const chars = new antlr4.InputStream(inputString);
            const lexer = new LetLexer(chars);
            const tokens = new antlr4.CommonTokenStream(lexer);

            const parser = new LetParser(tokens);
            // parser error handling setup
            parser.removeErrorListeners(); // remove the old
            parser.addErrorListener(new CustomError()); // add the new

            var tree;
            try { // try to parse
                tree = parser.start();
            } catch (error) {
                console.error(error.message);
                return callback(new repl.Recoverable(error)); // if it can't be parsed yet, get more input
            }

            const visitor = new Visitor();

            try { // try to visit and interpret the tree
                var result = visitor.visitStart(tree);
                //console.log(typeof(result));
                callback(null, result);
            } catch (error) {
                console.error(error);
                return callback(new repl.Recoverable(error)); // MAKE THIS NON RECOVERABLE???
            }

        } catch (error) {
            console.log(error);
            callback(new Error('uncaught error'));
        }
    }
}