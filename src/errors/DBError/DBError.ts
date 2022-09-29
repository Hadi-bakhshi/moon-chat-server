export class DBError extends Error {
    statusCode = 502

    constructor (message: string){
        super(message);

        Object.setPrototypeOf(this, DBError.prototype)
    }
}