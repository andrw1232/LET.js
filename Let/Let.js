import antlr4 from 'antlr4';
import LetLexer from './LetLexer.js';
import LetParser from './LetParser.js';
import LetVisitor from './MyLetVisitor.js';

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

const input = `-(-9,-(-5,-2))`;

const chars = new antlr4.InputStream(input);
const lexer = new LetLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new LetParser(tokens);
const tree = parser.start();

const visitor = new LetVisitor(); //

//console.log(tokens.getText());

//console.log(tree.getText());
var result = visitor.visitStart(tree); //
//console.log(tree.getText());

console.log(result);

