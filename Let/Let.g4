/**
Command to parse: antlr4-parse Let.g4 prog -gui
Command to compile to Javascript target: $ 
antlr4 -Dlanguage=JavaScript -visitor Let.g4
npm i antlr4@4.9.2

*/


grammar Let;
start: exp;
exp: Number #const // numval
    | '-''('exp','exp')' #diffexp
    | 'zero?' '('exp ')' #zero // boolval
    | 'if' exp 'then' exp 'else' exp #if
    | ID #var
    | 'let' ID '=' exp 'in' exp #let
;
Number: '-'? DIGIT+;
fragment DIGIT: [0-9]+;
ID: [a-zA-Z]+ ;
WHITESPACE : [\p{White_Space}]+ -> skip;
//([a-zA-Z0-9]|'_'| '?'| '-')+
