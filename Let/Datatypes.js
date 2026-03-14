


export default class expVal {

    // num vals
    static numVal(input) {
        var exp = new expVal();
        exp.type = "num";
        exp.val = input;
        return exp;
    }

    static isNum(input) {
        if (input.type === "num") {
            return true;
        } else {
            return false;
        }
    }

    static numEqual(x, y) {
        if (this.isNum(x) && this.isNum(y)) {
            if (x.val === y.val) {
                return true;
            }
        }
        return false;
    }

    // bool vals
    static boolVal(input) {

        var exp = new expVal();
        exp.type = "bool";
        exp.val = input;
        return exp;
    }

    
    static isBool(input) {
        if (input.type === "bool") { // should add a try catch if input isn't an object with field 'type'
            return true;
        } else {
            return false;
        }
    }


    static procVal(input) {
        var exp = new expVal();
        exp.type = "proc";
        exp.val = input; // array of: the ID, body (that needs to be visited), and env
        return exp;
    }

    static isProc(input) {
        if (input.type == "proc") {
            return true;
        } else {
            return false;
        }
    }


    // make a generic exp val and fit the type as best as possible
    static makeExpVal(input) {
        if (typeof(input) === "number") {
            return this.numVal(input);
        }
        if (typeof(input) === "boolean") {
            return this.boolVal(input);
        }
        if (typeof(input) === "function") {
            return this.procVal(input);
        }
        throw new Error("invalid LET datatype for: "+input);
    }

}