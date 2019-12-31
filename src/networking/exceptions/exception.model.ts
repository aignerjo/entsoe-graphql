
export class Exception extends Error {

    public static INVALID_DAY = '9000';
    public static INVALID_TIME_INTERVAL = '9001';

    // tslint:disable-next-line:variable-name
    private _code: number;

    constructor({ message, code }) {
        super(message);
        this._code = code;
    }

    get code(): number {
        return this._code;
    }
}
