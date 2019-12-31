import { HttpStatus } from '@nestjs/common';

import { HttpExceptionFilter } from './exception.filter';
import { Exception } from './exception.model';

class TestError implements Error {
    message: string;
    name: string;
    isAxiosError: boolean;
    response: object;
}

describe('HttpExceptionFilter', () => {
    it('should be defined', () => {
        const sut = new HttpExceptionFilter();
        expect(sut).toBeDefined();
    });

    it('should return exception if not axios error', () => {
        const sut = new HttpExceptionFilter();
        const error = new TestError();
        error.isAxiosError = false;

        const result = sut.catch(error as any, {} as any);
        expect(result).toEqual(error);
    });

    it('should return exception if none of the other errors', () => {
        const sut = new HttpExceptionFilter();
        const error = new TestError();
        error.response = { statusText: 'Method not allowed' };
        error.isAxiosError = true;

        const result = sut.catch(error as any, {} as any);
        expect(result.extensions).toEqual({ code: 'METHOD_NOT_ALLOWED' });
    });

    it('should throw invalid day exception if  error', () => {
        const sut = new HttpExceptionFilter();
        const error = new Exception({ message: 'Invalid day', code: Exception.INVALID_DAY });

        const result = sut.catch(error as any, {} as any);
        expect(result.message).toEqual('Invalid day requested');
        expect(result.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should throw invalid time interval exception if  error', () => {
        const sut = new HttpExceptionFilter();
        const error = new Exception({ message: 'Invalid time interval', code: Exception.INVALID_TIME_INTERVAL });

        const result = sut.catch(error as any, {} as any);
        expect(result.message).toEqual('Invalid time interval received');
        expect(result.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should throw invalid country requested exception if  error', () => {
        const sut = new HttpExceptionFilter();
        const error = new Exception({ message: 'Invalid country requested', code: Exception.INVALID_COUNTRY_PROVIDED });

        const result = sut.catch(error as any, {} as any);
        expect(result.message).toEqual('Not yet implemented');
        expect(result.status).toEqual(HttpStatus.NOT_IMPLEMENTED);
    });

});
