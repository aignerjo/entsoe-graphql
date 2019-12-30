export class Exception extends Error {

    public static INVALID_DAY = '9000';

    private _code: number;

    constructor({ message, code }) {
        super(message);
        this._code = code;
    }

    get code(): number {
        return this._code;
    }
}
