class ApiError extends Error{
    constructor(
        statusCode,
        message,
        errors = [],
        stackTrace = ''
    ){
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = null;
        this.success = false;

        if(stackTrace){
            this.stackTrace = stackTrace;
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError;