

export default class Env {

    /**
     * A function to pull the value associated with the variable within the environment
     * @param {*} env the environment which may contain a binding for the variable
     * @param {*} searchVar the variable to get the associated value for
     * @returns the value associated with the variable or null if no binding is in the environment.
     */
    static applyEnv(env, searchVar) {
        return env(searchVar);
    }


    /**
     * a function that creates a new and empty environment object
     * @returns an empty environment 
     */
    static emptyEnv() {
        return (searchVar) => {
            throw new Error("No binding found for "+searchVar);
        }
    }


    /**
     * a function to add a variable value pair to an existing environment
     * @param {*} variableArr the variables to associate with the values
     * @param {*} valueArr the values to associate with the variables
     * @param {*} env the environment to store the binding in
     * @returns a new environment with a new binding of the variable with the value
     */
    static extendEnv(variableArr, valueArr, env) {
        
        return (searchVar) => {

            if (variableArr.length == 0 || valueArr.length == 0) {
                return env(searchVar); // nothing left to check in the variableArray, so recurse to prev env

            } else if (searchVar == variableArr[0]) {
                return valueArr[0]; // variable found!

            } else {
                var removedVar = variableArr.shift(); // remove the first elements from each variable value pair to recurse down without them in the array object
                var removedVal = valueArr.shift();
                var result = this.extendEnv(variableArr, valueArr, env)(searchVar); // recurse
                variableArr.unshift(removedVar); // restore the environment state as we recurse back up.
                valueArr.unshift(removedVal);
                return result;
            }
        }
    }





}