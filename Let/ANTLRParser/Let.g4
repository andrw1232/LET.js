/**
Command to parse: antlr4-parse Let.g4 prog -gui
Command to compile to Javascript target: $ 
antlr4 -Dlanguage=JavaScript -visitor Let.g4
npm i antlr4@4.9.2

*/


grammar Let;
start: exp;
exp: Number #const // -> numval
    | '-''('exp','exp')' #diff // -> numval
    | '-''('exp','exp')' #diff // -> numval
    | 'zero?' '('exp ')' #zero // -> boolval
    | 'if' exp 'then' exp 'else' exp #if // -> expval
    | ID #var // -> ID
    | 'let' (ID '=' exp)* 'in' exp #let // -> expval
    | 'proc' '(' (ID (',' ID)* )? ')' exp #proc // -> procval // -> procval
    | '(' exp exp* ')' #call // -> expval
    | 'letrec' (ID '(' ID ')' '=' exp (ID '(' ID ')' '=' exp)*)? 'in' exp #letrec // -> expval // -> expval
;
Number: '-'? DIGIT+ ('.' DIGIT+ )?;
fragment DIGIT: [0-9];
ID: [a-zA-Z] ([a-zA-Z0-9] | '?' | '_' | '-')* ;
WHITESPACE : [\p{White_Space}]+ -> skip;