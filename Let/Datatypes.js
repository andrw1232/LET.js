


export default class expval {

    // num vals
    static numVal(input) {
        var exp = new expval();
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

        var exp = new expval();
        exp.type = "bool";
        exp.val = input;
        return exp;
    }

    
    static isBool(input) {
        if (input.type === "bool") {
            return true;
        } else {
            return false;
        }
    }


    static procVal(input) {
        var exp = new expval();
        exp.type = "proc";
        exp.val = input; // array of: [the IDs], body (that needs to be visited), and env
        return exp;
    }

    static isProc(input) {
        if (input.type == "proc") {
            return true;
        } else {
            return false;
        }
    }

    static getPrintableVal(input) {
        if (input.type == "proc") {
            return "[Function (anonymous)]";
        } else {
            return input.val;
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