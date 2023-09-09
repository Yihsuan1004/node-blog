class HttpError extends Error {
    constructor(message, errorCode){
        super(message);
        this.code = errorCode;
    }

    // Method to transform error to JSON format
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message
            }
        };
    }
}

module.exports = HttpError;