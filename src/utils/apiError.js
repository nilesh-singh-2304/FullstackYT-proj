class ApiError extends Error{
    constructor(
        statusCode,
        message = "Someting went wrong",
        errors = [],
        stack = ""
    ){
        super(message);          //super class Error ka constructor call kr rhe h
        this.statusCode = statusCode; //custom property
        this.message = message; //custom property
        this.data = null;
        this.success = false;
        this.errors = errors;

        if(stack){
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};