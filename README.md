# The Let.js Project

## Description
This project is a JavaScript implementation of an interpreter for the LET language (and it's extensions) found in the Essentials of Programming Languages textbook by Daniel P. Friedman and Mitchell Wand<sup>1</sup>. It utilizes the ANTLR<sup>2</sup> parser generator to scan and parse input sentences of the LET language.


<sup>1</sup> D. P. Friedman and M. Wand, Essentials of programming languages, Third edition. Cambridge, Massachusetts London, England: MIT Press, 2008. 

<sup>2</sup> https://www.antlr.org/

### The LET language 

```plantuml
hide footbox


skinparam BoxPadding 100
skinparam ParticipantPadding 20
skinparam Padding 5


actor Programmer
box "LET" #LightGray
	participant FE as "**Front End**\n//Main.js//"
    participant ANTLR as "**ANTLR Parser**\n//interpreter.js"
	participant Interpreter as "**MyLetVisitor.js**\n////"
end box

participant Terminal as "**Terminal**\n//output//"

activate Programmer
activate Terminal

Programmer     -> FE                    : LET Program Sentence

activate FE
FE             -> ANTLR                 : LET Program Sentence
deactivate FE

activate ANTLR
ANTLR             -> Interpreter            : LET Parse Tree
deactivate ANTLR




activate Interpreter
Interpreter    -> Terminal              : Answer\n(//value//)
deactivate Interpreter

deactivate Programmer
deactivate Terminal
```


## Getting Started

### Installing


Download all the files from the repository. 

The ANTLR command line tool can be downloaded from the ANTLR website linked above. Node.js is also required and can be downloaded from the Node website https://nodejs.org/en. 
This project was built using Node version 18.19.1. Your node version can be checked by typing `node` in the terminal. 
This project was built using ANTLR4 version 4.9.2. Your ANTLR4 version can be checked by typing `antlr4` in the terminal.

Navigate to inside of the Let folder. Use the following command to download the ANTLR runtime library from the node package manager, npm.

```bash
npm i antlr4@4.9.2
```

Navigate to inside the ANTLRParser folder and run the following command.

```bash
antlr4 -Dlanguage=JavaScript -visitor Let.g4
```


### Executing

Navigate to the Let folder. The Let language can be interacted with via a read eval input loop with the following command.

```bash
node Main.js
```

LET programs can also be executed from a file with the following command.

```bash
node Main.js exampleProgram.txt
```

The test suite can be executed and checked with the following command. No output will be generated if all tests pass.

```bash
node Tests.js
```

### Web Version

A simple locally hosted web server is also provided to execute LET programs from a web browser. Navigate to the Let folder and run the following command.

```bash
node Server.js
```

The Let.js website can then be accessed at http://127.0.0.1:8000.


## Help

For ANTLR related questions please see the ANTLR docs https://github.com/antlr/antlr4/blob/master/doc/index.md.

For Node.js questiosn please see the Node.js docs https://nodejs.org/docs/latest/api/.


## Author

Project built by Andrew Traynor at The King's University.

## Acknowledgments

Dr. Andrew Tappenden for help and advice throughout the entire research and development process.

The King's University for use of their lab environment. 