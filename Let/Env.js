/**
 * A function to pull the value associated with the variable within the environment
 * @param {*} env the environment which may contain a binding for the variable
 * @param {*} variable the variable to get the associated value for
 * @returns the value associated with the variable or null if no binding is in the environment.
 */
export function applyEnv(env, variable) {
    
    // console.log("apply: "+env);
    
    if (env.length == 0) {
        console.log("UH OH!!!!!! variable not found in the environment");
        return null;
    }
    else if (env[0][0] == variable) {
        //console.log("here"+env[0][1]);
        return env[0][1];
    }
    else {
        var localEnv = envCopy(env);
        

        localEnv.shift(); // removes the first element of the array
        //console.log("env: "+env+" local: "+localEnv);

        return applyEnv(localEnv, variable);
    }
}


/**
 * a function that creates a new and empty environment object
 * @returns an empty environment 
 */
export function emptyEnv() {
    //console.log("env created");
    return Array();
}


/**
 * a function to add a variable value pair to an existing environment
 * @param {*} variable the varaible to associate with the value
 * @param {*} value the value to associate with the variable
 * @param {*} env the environemnt to store the binding in
 * @returns a new environment with a new binding of the variable with the value
 */
export function extendEnv(variable, value, env) {
    var localEnv = envCopy(env);
    localEnv.unshift(new Array(variable,value)); // places the new element at the beginning of the array
    //console.log("extended: "+localEnv);
    return localEnv;
}


function envCopy(arr) {

    var newArray = new Array(arr.length);

    for (let i = 0; i < newArray.length; i++) {
        newArray[i] = new Array(arr[i][0],arr[i][1]);    
    }
    //console.log("old: "+arr);
    //console.log("new: "+newArray)
    return newArray;
}