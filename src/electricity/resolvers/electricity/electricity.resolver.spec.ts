import { Test, TestingModule } from '@nestjs/testing';

import { Range } from '../../pipes/day-to-range.pipe';
import { ElectricityService } from '../../services/electricity.service';
import { SolarElectricityLoader } from '../../loaders/solar-electricity.loader';

import { ElectricityResolver } from './electricity.resolver';

describe('ElectricityResolver', () => {
    let resolver: ElectricityResolver;
    let electricityService: ElectricityService;
    let solarElectricityLoader: SolarElectricityLoader;

    const countryFixture = 'DE';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElectricityResolver,
                { provide: ElectricityService, useValue: { getElectricity: () => null } },
                { provide: SolarElectricityLoader, useValue: { load: () => null } },
            ],
        }).compile();

        resolver = module.get<ElectricityResolver>(ElectricityResolver);
        electricityService = module.get<ElectricityService>(ElectricityService);
        solarElectricityLoader = module.get<SolarElectricityLoader>(SolarElectricityLoader);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should resolve total electricity', async () => {
        const spy = spyOn(electricityService, 'getElectricity');
        const period: Range = {
            start: '201912232300',
            end: '201912242300'
        };
        await resolver.getElectricity(period, countryFixture, {});
        expect(spy).toHaveBeenCalledWith({ period, countryCode: countryFixture });
    });

    it('should resolve solar electricity', async () => {
        const spy = spyOn(solarElectricityLoader, 'load');
        const period: Range = {
            start: '201912232300',
            end: '201912242300'
        };
        await resolver.getSolarAmount({ id: 1 }, { params: { period, countryFixture } });
        expect(spy).toHaveBeenCalledWith({ params: { period, countryFixture }, parent: { id: 1 } });
    });
});
