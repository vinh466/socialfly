

class ApiError extends Error {
    statusCode: number;
    error: any;

    constructor(statusCode: number, message: string, error: any = null) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
    }
}

export default ApiError;