import { Test, TestingModule } from '@nestjs/testing';

import { Range } from '../../pipes/day-to-range.pipe';
import { ElectricityService } from '../../services/electricity.service';
import { SolarElectricityLoader } from '../../loaders/solar-electricity.loader';
import { WindOffshoreElectricityLoader } from '../../loaders/wind-offshore-electricity.loader';
import { WindOnshoreElectricityLoader } from '../../loaders/wind-onshore-electricity.loader';

import { ElectricityResolver } from './electricity.resolver';

describe('ElectricityResolver', () => {
    let resolver: ElectricityResolver;
    let electricityService: ElectricityService;
    let solarElectricityLoader: SolarElectricityLoader;
    let windOnshoreLoader: WindOnshoreElectricityLoader;
    let windOffshoreLoader: WindOffshoreElectricityLoader;

    const countryFixture = 'DE';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElectricityResolver,
                { provide: ElectricityService, useValue: { getForecast: () => null } },
                { provide: SolarElectricityLoader, useValue: { load: () => null } },
                { provide: WindOnshoreElectricityLoader, useValue: { load: () => null } },
                { provide: WindOffshoreElectricityLoader, useValue: { load: () => null } },
            ],
        }).compile();

        resolver = module.get<ElectricityResolver>(ElectricityResolver);
        electricityService = module.get<ElectricityService>(ElectricityService);
        solarElectricityLoader = module.get<SolarElectricityLoader>(SolarElectricityLoader);
        windOnshoreLoader = module.get<WindOnshoreElectricityLoader>(WindOnshoreElectricityLoader);
        windOffshoreLoader = module.get<WindOffshoreElectricityLoader>(WindOffshoreElectricityLoader);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should resolve total electricity', async () => {
        const spy = spyOn(electricityService, 'getForecast');
        const period: Range = {
            start: '201912232300',
            end: '201912242300'
        };
        await resolver.totalForecast(period, countryFixture, {});
        expect(spy).toHaveBeenCalledWith({ period, countryCode: countryFixture });
    });

    it('should resolve solar forecast', async () => {
        const spy = spyOn(solarElectricityLoader, 'load');
        const period: Range = {
            start: '201912232300',
            end: '201912242300'
        };
        await resolver.solarForecast({ id: 1 }, { params: { period, countryFixture } });
        expect(spy).toHaveBeenCalledWith({ params: { period, countryFixture }, parent: { id: 1 } });
    });

    it('should resolve onshore wind forecast', async () => {
        const spy = spyOn(windOnshoreLoader, 'load');
        const period: Range = {
            start: '201912232300',
            end: '201912242300'
        };
        await resolver.windOnshoreForecast({ id: 1 }, { params: { period, countryFixture } });
        expect(spy).toHaveBeenCalledWith({ params: { period, countryFixture }, parent: { id: 1 } });
    });

    it('should resolve offshore wind forecast', async () => {
        const spy = spyOn(windOffshoreLoader, 'load');
        const period: Range = {
            start: '201912232300',
            end: '201912242300'
        };
        await resolver.windOffshoreForecast({ id: 1 }, { params: { period, countryFixture } });
        expect(spy).toHaveBeenCalledWith({ params: { period, countryFixture }, parent: { id: 1 } });
    });
});
