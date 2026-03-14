/**
 * A function to pull the value associated with the variable within the environment
 * @param {*} env the environment which may contain a binding for the variable
 * @param {*} variable the variable to get the associated value for
 * @returns the value associated with the variable or null if no binding is in the environment.
 */
export function applyEnv(env, variable) {

    if (env.length == 0) { // no where left to search
        throw new Error("Unbound variable: "+variable);
    }
    else {
        for (let i = 0; i < env[0][0].length; i++) {
            if (env[0][0][i] == variable) {
                return env[0][1][i];
            }
        }
        var localEnv = envCopy(env);
        localEnv.shift()
        return applyEnv(localEnv, variable);

    }
}


/**
 * a function that creates a new and empty environment object
 * @returns an empty environment 
 */
export function emptyEnv() {
    return Array();
}


/**
 * a function to add a variable value pair to an existing environment
 * @param {*} variableArr the variables to associate with the values
 * @param {*} valueArr the values to associate with the variables
 * @param {*} env the environment to store the binding in
 * @returns a new environment with a new binding of the variable with the value
 */
export function extendEnv(variableArr, valueArr, env) {
    var localEnv = envCopy(env);

    // places the two new lists into a new array at the beginning of the environment array
    localEnv.unshift(new Array(variableArr,valueArr)); 
    return localEnv;
}


// [[[],[]] , [[],[]]] two extends

// makes a deep copy of an environment
export function envCopy(arr) {
    //console.log(arr);
    var newArray = new Array(arr.length);
    for (let i = 0; i < newArray.length; i++) {
        newArray[i] = [arr[i][0], arr[i][1]];
    }
    return newArray;
}

