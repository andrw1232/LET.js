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
    | '+''('exp','exp')' #addexp // -> numval
    | '*''('exp','exp')' #mulexp // -> numval
    | '/''('exp','exp')' #divexp // -> numval
    | 'minus' '('exp')' #unaryminus // -> numval
    | 'zero?' '('exp ')' #zero // -> boolval
    | 'equal?' '('exp','exp')' #equal // -> boolval
    | 'greater?' '('exp','exp')' #greater // -> boolval
    | 'lesser?' '('exp','exp')' #less// -> boolval
    | 'if' exp 'then' exp 'else' exp #if // -> expval
    | ID #var // -> ID
    | 'let' (ID '=' exp)* 'in' exp #let // -> expval
;
Number: '-'? DIGIT+ ('.' DIGIT+ )?;
fragment DIGIT: [0-9];
ID: [a-zA-Z] ([a-zA-Z0-9] | '?' | '_' | '-')* ;
WHITESPACE : [\p{White_Space}]+ -> skip;
