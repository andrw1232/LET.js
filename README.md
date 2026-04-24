# The Let.js Project

## Description
This project is a JavaScript implementation of an interpreter for the LET language (and it's extensions) found in the Essentials of Programming Languages textbook by Daniel P. Friedman and Mitchell Wand<sup>1</sup>. It utilizes the ANTLR<sup>2</sup> parser generator to scan and parse input sentences of the LET language.


<sup>1</sup> D. P. Friedman and M. Wand, Essentials of programming languages, Third edition. Cambridge, Massachusetts London, England: MIT Press, 2008. 

<sup>2</sup> https://www.antlr.org/


## Getting Started

Download all the files from the repository. 

The ANTLR command line tool can be downloaded from the ANTLR website linked above. Node.js is also required and can be downloaded from the Node website https://nodejs.org/en.

Navigate to inside of the Let folder. Use the following command to download the ANTLR runtime library from the node package manager, npm.

```bash
npm i antlr4@4.9.2
```



### Installing

### Executing
Built using antlr4 version 4.9.2. The matching antlr4 JavaScript runtime environment can be downloaded using npm i antlr4@4.9.2 command.

The following command will build the JavaScript grammer handling classes: antlr4 -Dlanguage=JavaScript -visitor Let.g4

Ensure the package.json file includes: "type": "module"

Use the following command to run: node let.js

## Help

## Author

## Acknowledgments