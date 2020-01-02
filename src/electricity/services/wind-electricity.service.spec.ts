import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { EntsoeService } from '../../networking/services/entsoe.service';
import * as windForecastMock from '../../../test-resources/mocks/wind-forecast.json';

import { WindElectricityService } from './wind-electricity.service';

describe('WindElectricityService', () => {
    let service: WindElectricityService;
    let apiService: EntsoeService;

    const parentFixture = { totalLoad: 100 };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WindElectricityService,
                { provide: EntsoeService, useValue: { get: () => of(windForecastMock.parsed) } },
            ],
        }).compile();

        apiService = module.get<EntsoeService>(EntsoeService);
        service = module.get<WindElectricityService>(WindElectricityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get the wind offshore forecast', async () => {
        const params = { period: { start: '201912232300', end: '201912242300' }, countryCode: 'DE' };
        const data = await service.getWindOffshoreElectricity(parentFixture, params);

        const expected = windForecastMock.parsed.GL_MarketDocument.TimeSeries.Period.Point;
        expect(data.length).toEqual(expected.length);
        expect(data[0].amount).toEqual(expected[0].quantity);
        expect(data[0].percentage).toEqual(expected[0].quantity / parentFixture.totalLoad);
    });

    it('should get the wind onshore forecast', async () => {
        const params = { period: { start: '201912232300', end: '201912242300' }, countryCode: 'DE' };
        const data = await service.getWindOnshoreElectricity(parentFixture, params);

        const expected = windForecastMock.parsed.GL_MarketDocument.TimeSeries.Period.Point;
        expect(data.length).toEqual(expected.length);
        expect(data[0].amount).toEqual(expected[0].quantity);
        expect(data[0].percentage).toEqual(expected[0].quantity / parentFixture.totalLoad);
    });
});
