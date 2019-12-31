import { HttpService, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Range } from '../../electricity/pipes/day-to-range.pipe';
import * as electricityForecastMock from '../../../test-resources/mocks/electricity-forecast.json';
import { EntsoeDtoModel } from '../models/entsoe-dto.model';
import { HttpServiceMock } from '../../../test/http-service-mock';
import { LoggingService } from '../logging/logging.service';
import * as solarForecastMock from '../../../test-resources/mocks/solar-forecast.json';
import { tick } from '../../../test/tick';

import { ENTSOE_API_URL, ENTSOE_SECURITY_TOKEN, EntsoeService } from './entsoe.service';

interface MockData {
    data: string;
    params: any;
    parsed: any;
}

describe('EntsoeService', () => {
    let service: EntsoeService;
    let loggingService: LoggingService;
    let mockClient: HttpServiceMock;
    let interceptorMock;

    const securityTokenFixture = 'SECURITY_TOKEN';

    const rangeFixture: Range = { start: '201912232300', end: '201912242300' };
    const countryFixture = '10Y1001A1001A83F';

    beforeEach(async () => {
        mockClient = new HttpServiceMock();
        interceptorMock = {
            interceptors: {
                request: { use: (request) => request },
                response: { use: (request) => request }
            }
        };
        mockClient['axiosRef'] = interceptorMock;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: HttpService, useValue: mockClient },
                { provide: ENTSOE_API_URL, useValue: '' },
                { provide: ENTSOE_SECURITY_TOKEN, useValue: securityTokenFixture },
                LoggingService,
                EntsoeService],
        }).compile();

        service = module.get<EntsoeService>(EntsoeService);
        loggingService = module.get<LoggingService>(LoggingService);
    });

    it('checks base url on initialization', () => {
        try {
            // tslint:disable-next-line:no-unused-expression
            new EntsoeService(mockClient as any, null, null, '');
            fail();
        } catch (error) {
            expect(error.message).toEqual('The environment variable ENTSOE_API_URL is not set.');
        }
    });

    it('checks security token on initialization', () => {
        try {
            // tslint:disable-next-line:no-unused-expression
            new EntsoeService(mockClient as any, null, '', null);
            fail();
        } catch (error) {
            expect(error.message).toEqual('The environment variable ENTSOE_SECURITY_TOKEN is not set.');
        }
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get the solar forecast for a given range', async () => {
        const solarForecastFixture: MockData = solarForecastMock as any;

        const incoming = spyOn(loggingService, 'logHttpResponse');
        const outgoing = spyOn(loggingService, 'logHttpRequest');

        const result = service.getSolarForecast(rangeFixture.start, rangeFixture.end, countryFixture).toPromise();
        await tick();

        mockClient.flush(200, solarForecastFixture.data, {});
        mockClient.popRequest(req => {
            expect(req.params).toEqual(solarForecastFixture.params);
        });

        const data: EntsoeDtoModel = await result;
        expect(data).toEqual(solarForecastFixture.parsed);

        expect(incoming).toHaveBeenCalled();
        expect(outgoing).toHaveBeenCalled();

    });

    it('should fail if solar forecast request failed', async () => {
        const solarForecastFixture: MockData = solarForecastMock as any;
        const result = service.getSolarForecast(rangeFixture.start, rangeFixture.end, countryFixture).toPromise();
        await tick();

        mockClient.flush(HttpStatus.BAD_REQUEST, '<xml>Error</xml>', {});
        mockClient.popRequest(req => {
            expect(req.params).toEqual(solarForecastFixture.params);
        });

        try {
            await result;
            fail();
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    it('should get the total electricity forecast for a given range', async () => {
        const incoming = spyOn(loggingService, 'logHttpResponse');
        const outgoing = spyOn(loggingService, 'logHttpRequest');

        const electricityForecastFixture: MockData = electricityForecastMock as any;
        const result = service.getElectricity(rangeFixture.start, rangeFixture.end, countryFixture).toPromise();
        await tick();

        mockClient.flush(200, electricityForecastFixture.data, {});
        mockClient.popRequest(req => {
            expect(req.params).toEqual(electricityForecastFixture.params);
        });

        const data: EntsoeDtoModel = await result;
        expect(data).toEqual(electricityForecastFixture.parsed);

        expect(incoming).toHaveBeenCalled();
        expect(outgoing).toHaveBeenCalled();

    });

    it('should fail if electricity forecast request failed', async () => {
        const electricityForecastFixture: MockData = electricityForecastMock as any;
        const result = service.getElectricity(rangeFixture.start, rangeFixture.end, countryFixture).toPromise();
        await tick();

        mockClient.flush(HttpStatus.BAD_REQUEST, '<xml>Error</xml>', {});
        mockClient.popRequest(req => {
            expect(req.params).toEqual(electricityForecastFixture.params);
        });

        try {
            await result;
            fail();
        } catch (e) {
            expect(e).toBeDefined();
        }

    });
});
