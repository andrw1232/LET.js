import antlr4 from 'antlr4';




export default class ErrorLet extends antlr4.error.ErrorListener {

    
    
    // https://stackoverflow.com/questions/30276048/handling-errors-in-antlr4-javascript
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        throw "My Error at line "+line+":"+column+ " "+msg;

    }    


}