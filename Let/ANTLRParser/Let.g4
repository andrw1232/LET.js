/**
Command to parse: antlr4-parse Let.g4 prog -gui
Command to compile to Javascript target: $ 
antlr4 -Dlanguage=JavaScript -visitor Let.g4
npm i antlr4@4.9.2

*/


grammar Let;
start: exp;
exp: Number #const // -> numval
    | '-''('exp','exp')' #diffexp // -> numval
    | 'zero?' '('exp ')' #zero // -> boolval
    | 'if' exp 'then' exp 'else' exp #if // -> expval
    | ID #var // -> ID
    | 'let' (ID '=' exp)* 'in' exp #let // -> expval
    | 'proc' '(' ID ')' exp #proc
    | '(' exp exp ')' #call
    | 'letrec' ID '(' ID ')' '=' exp 'in' exp #letrec
;
Number: '-'? DIGIT+ ('.' DIGIT+ )?;
fragment DIGIT: [0-9];
ID: [a-zA-Z] ([a-zA-Z0-9] | '?' | '_' | '-')* ;
WHITESPACE : [\p{White_Space}]+ -> skip;
