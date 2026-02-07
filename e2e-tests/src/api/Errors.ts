export class ApiError extends Error {
    status: number;
    body: {
        error: string;
        message: string;
    };

    constructor(status: number, body: {error: string, message: string }) {
        super(`API returned ${status}: ${body.error} - ${body.message}`);
        this.status = status;
        this.body = body;
    }
}