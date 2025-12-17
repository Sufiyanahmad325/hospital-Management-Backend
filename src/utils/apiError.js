class ApiError extends Error {
    constructor(message = 'Something went wrong', statusCode = 500, error = [], stack = '') {
        // अगर message object है तो JSON बना दो
        super(typeof message === "object" ? JSON.stringify(message) : message);

        this.statusCode = statusCode || 500;
        this.error = error;
        this.data = null;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;