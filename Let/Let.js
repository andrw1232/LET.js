import repl from 'node:repl';
import fs from 'node:fs';
import LetInterpreter from './LetInterpreter.js';
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


// main entry point




// if a file is passed as an argument on the command line
if (process.argv.length > 2) {

    fs.readFile(process.argv[2], 'utf8', (err, data) => {
        // if there is an error reading the file, print the error
        if (err) {
            console.log(err);
            return;
        }
        console.log(LetInterpreter.parse(data)); // parse the contents of the file
    });
} 
else {
    //console.log("here");
    // make REPL. prompt is the line start character(s). parse is the interpreting function.
    const r = repl.start( {prompt: "->", eval: LetInterpreter.parseREPL} );
    
    // REPL exit message
    r.on('exit', () => {
        console.log("Thanks for using LET");
    }); 
}



