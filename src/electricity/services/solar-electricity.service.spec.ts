import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { EntsoeService } from '../../networking/services/entsoe.service';
import * as solarForecastMock from '../../../test-resources/mocks/solar-forecast.json';

import { SolarElectricityService } from './solar-electricity.service';

describe('SolarElectricityService', () => {
    let service: SolarElectricityService;
    let apiService: EntsoeService;

    const parentFixture = { totalLoad: 100 };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SolarElectricityService,
                { provide: EntsoeService, useValue: { get: () => of(solarForecastMock.parsed) } },
            ],
        }).compile();

        apiService = module.get<EntsoeService>(EntsoeService);
        service = module.get<SolarElectricityService>(SolarElectricityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get the solar forecast', async () => {
        const params = { period: { start: '201912232300', end: '201912242300' }, countryCode: 'DE' };
        const data = await service.getSolarElectricity(parentFixture, params);

        const expected = solarForecastMock.parsed.GL_MarketDocument.TimeSeries.Period.Point;
        expect(data.length).toEqual(expected.length);
        expect(data[0].amount).toEqual(expected[0].quantity);
        expect(data[0].percentage).toEqual(expected[0].quantity / parentFixture.totalLoad);
    });
});
