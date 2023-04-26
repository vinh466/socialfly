

class ApiError extends Error {
    statusCode: number;
    error: any;

    constructor(statusCode: number, message: string, name: string = '') {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.name = name;
    }
}

export default ApiError;