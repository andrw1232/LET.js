import antlr4 from 'antlr4';
import LetLexer from './LetLexer.js';
import LetParser from './LetParser.js';
import LetVisitor from './MyLetVisitor.js';
import repl from 'node:repl';
import ErrorLet from './ErrorLet.js';
import fs from 'node:fs';

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



// most basic parsing of a string
function parse(inputData) {

    const chars = new antlr4.InputStream(inputData);
    const lexer = new LetLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new LetParser(tokens);
    const tree = parser.start();
    const visitor = new LetVisitor();
    // visit the tree to get the result
    const result = visitor.visitStart(tree);
    console.log(result);

}



function parseREPL(inputString, context, replResourceName, callback) {

    try {

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
            return callback(new repl.Recoverable(error));
        }

        const visitor = new LetVisitor();

        try {
            var result = visitor.visitStart(tree);
            callback(null, result);
        } catch (error) {
            return callback(new repl.Recoverable(error));
        }

    } catch (error) {
        console.log(error);
        callback(new Error('uncaught error'));
    }
}

// if a file is passed as an argument on the command line
if (process.argv.length > 2) {
    // console.log("A file was passed");

    fs.readFile(process.argv[2], 'utf8', (err, data) => {
        // if there is na error reading the file, print the error
        if (err) {
            console.log(err);
            return;
        }
        parse(data); // parse the contents of the file
    });
} 
else {
    // make REPL. prompt is the line start character(s). parse is the interpreting function.
    const r = repl.start( {prompt: "->", eval: parseREPL} );
    
    // REPL exit message
    r.on('exit', () => {
        console.log("Thanks for using LET");
    }); 
}



