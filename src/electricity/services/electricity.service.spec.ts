import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import * as electricityForecastMock from '../../../test-resources/mocks/electricity-forecast.json';
import { EntsoeService } from '../../networking/services/entsoe.service';
import { ParseIntervalPipe } from '../pipes/parse-interval.pipe';

import { ElectricityService } from './electricity.service';

describe('ElectricityService', () => {
    let service: ElectricityService;
    let apiService: EntsoeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElectricityService,
                ParseIntervalPipe,
                { provide: EntsoeService, useValue: { get: () => of(electricityForecastMock.parsed) } },
            ],
        }).compile();

        apiService = module.get<EntsoeService>(EntsoeService);
        service = module.get<ElectricityService>(ElectricityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get the total forecast', async () => {
        const params = { period: { start: '201912232300', end: '201912242300' }, countryCode: 'DE' };
        const data = await service.getForecast(params);

        const expected = electricityForecastMock.parsed.GL_MarketDocument.TimeSeries.Period.Point;
        expect(data.length).toEqual(expected.length);
        expect(data[0].totalLoad).toEqual(expected[0].quantity);
        expect(data[0].timestamp).toEqual(new Date(electricityForecastMock.parsed.GL_MarketDocument.TimeSeries.Period.timeInterval.start));
        expect(data[0].id).toEqual(1);
    });
});
