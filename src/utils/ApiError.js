class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message),                 // Calls parent Error class constructor
        this.statusCode = statusCode,     
        this.message = message,
        this.data = null,               // Always null for error responses
        this.success = false,
        this.errors = errors            // Additional error details

        if(stack) {
            this.stack = stack          // Used provided stack trace
        }else {
            this.captureStackTrace(this, this.construcor)  // Generates stack trace excluding constructor call.
        }
    }
}

export {ApiError}