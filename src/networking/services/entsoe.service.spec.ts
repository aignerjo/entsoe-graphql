import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpServiceMock } from '../../../test/http-service-mock';
import { LoggingService } from '../logging/logging.service';

import { ENTSOE_API_URL, ENTSOE_SECURITY_TOKEN, EntsoeService } from './entsoe.service';

describe('EntsoeService', () => {
    let service: EntsoeService;
    let mockClient: HttpServiceMock;

    beforeEach(async () => {
        mockClient = new HttpServiceMock();
        mockClient['axiosRef'] = {
            interceptors: {
                request: { use: () => null },
                response: { use: () => null }
            }
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: HttpService, useValue: mockClient },
                { provide: ENTSOE_API_URL, useValue: '' },
                { provide: ENTSOE_SECURITY_TOKEN, useValue: '' },
                LoggingService,
                EntsoeService],
        }).compile();

        service = module.get<EntsoeService>(EntsoeService);
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

    // it('get cluster', async () => {
    //     const result = service.getCluster(1);
    //     await tick();
    //
    //     mockClient.flush(200, { id: 1 }, {});
    //     mockClient.popRequest(req => {
    //         expect(req.url).toEqual('/1');
    //         expect(req.params).not.toBeDefined();
    //         expect(req.headers).not.toBeDefined();
    //     });
    //
    //     await result;
    // });
    // it('clusters without args', async () => {
    //     const result = service.getClusters();
    //     await tick();
    //
    //     mockClient.flush(200, clustersFixture, {});
    //     mockClient.popRequest(req => {
    //         expect(req.url).toEqual('');
    //         expect(req.params).toEqual({});
    //         expect(req.headers).toEqual({});
    //     });
    //
    //     await result;
    // });
    //
    // it('clusters with args', async () => {
    //     const result = service.getClusters(1, 50, 'filterFixture', 'sortFixture', 'queryFixture');
    //     await tick();
    //
    //     mockClient.flush(200, clustersFixture, {});
    //     mockClient.popRequest(req => {
    //         expect(req.url).toEqual('');
    //         expect(req.params).toEqual({ filterBy: 'filterFixture', query: 'queryFixture', sortBy: 'sortFixture' });
    //         expect(req.headers).toEqual({ 'X-Page-Size': 50, 'Range': 'pages 1' });
    //     });
    //
    //     await result;
    // });
});
