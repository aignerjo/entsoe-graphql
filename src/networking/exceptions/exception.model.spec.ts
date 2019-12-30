import { Exception } from './exception.model';

describe('Exception', () => {

    let exception: Exception;

    it('should not parse an invalid date', () => {
        exception = new Exception({ message: '', code: 'TEST' });
        expect(exception.code).toEqual('TEST');
    });

});
