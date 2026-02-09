/**
Command to parse: antlr4-parse Let.g4 prog -gui
Command to compile to Javascript target: $ 
antlr4 -Dlanguage=JavaScript Let.g4

*/

grammar Let;
start: exp;
exp: INT #const
    | '-''('exp','exp')' #diffexp
    | 'zero?' '('exp ')' #zero
    | 'if' exp 'then' exp 'else' exp #if
    | ID #var
    | 'let' (ID '=' exp)* 'in' exp #let
;
ID: [a-zA-Z]+;
INT:[0-9]+;
WHITESPACE : [\p{White_Space}]+ -> skip;




