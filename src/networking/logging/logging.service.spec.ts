import { HttpStatus } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { LoggingService } from './logging.service';

describe('LoggingService', () => {

    let service: LoggingService;

    beforeAll(() => {
        service = new LoggingService();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should log an http request', () => {
        const logSpy = spyOn(service['logger'], 'info');

        service.logHttpRequest({}, 'test');
        expect(logSpy).toHaveBeenCalledWith({
            body: undefined,
            headers: undefined,
            message: 'test request: undefined undefined',
            method: undefined,
            url: undefined,
        });
    });

    it('should log an http request with more details', () => {
        const logSpy = spyOn(service['logger'], 'info');

        service.logHttpRequest({
            method: 'get',
            url: '/TEST',
            headers: {
                why: 'test',
                because: 'great',
            },
            data: 'Woop Woop!',
        } as any as AxiosRequestConfig, 'test');
        expect(logSpy).toHaveBeenCalledWith({
                headers: { because: 'great', why: 'test' },
                message: 'test request: get /TEST',
                method: 'get',
                url: '/TEST',
            },
        );
    });

    it('should log an http response', () => {
        const logSpy = spyOn(service['logger'], 'debug');

        service.logHttpResponse({} as any as AxiosResponse);
        expect(logSpy).toHaveBeenCalledWith({
            body: undefined,
            headers: undefined,
            message: 'response from outgoing request to undefined with status: undefined',
            method: undefined,
            url: undefined,
        });
    });

    it('should log an http response with more details', () => {
        const logSpy = spyOn(service['logger'], 'debug');

        service.logHttpResponse({
            config: {
                url: '/TEST',
            },
            headers: {
                because: 'great',
                why: 'test',
                invalid: { do: 'ignore this' },
                securityToken: 'Bearer ey12i94zu1njwdapnjsdips',
                SecurityToken: 'Bearer 12905781892uz5891',
            },
            status: HttpStatus.I_AM_A_TEAPOT,
            data: '<data>Woop Woop!</data>',
        } as any as AxiosResponse);
        expect(logSpy).toHaveBeenCalledWith({
            body: { data: 'Woop Woop!' },
            headers: { because: 'great', why: 'test' },
            message: 'response from outgoing request to /TEST with status: 418',
            url: '/TEST',
            status: HttpStatus.I_AM_A_TEAPOT,
        });
    });
});
