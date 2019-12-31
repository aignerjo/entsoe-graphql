import { Test, TestingModule } from '@nestjs/testing';

import { SolarElectricityService } from '../../services/solar-electricity.service';

import { ElectricityMixResolver, ElectricityParent } from './electricity-mix.resolver';

describe('ElectricityMixResolver', () => {
    let resolver: ElectricityMixResolver;
    let solarElectrcityService: SolarElectricityService;

    const countryFixture = '10Y1001A1001A83F';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElectricityMixResolver,
                { provide: SolarElectricityService, useValue: { getSolarElectricity: () => null } },
            ],
        }).compile();

        resolver = module.get<ElectricityMixResolver>(ElectricityMixResolver);
        solarElectrcityService = module.get<SolarElectricityService>(SolarElectricityService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should resolve solar electricity', async () => {
        const spy = spyOn(solarElectrcityService, 'getSolarElectricity');
        const parent: ElectricityParent = {
            position: 1,
            periodStart: '201912232300',
            periodEnd: '201912242300',
            countryCode: countryFixture
        };
        await resolver.getSolarAmount(parent);
        expect(spy).toHaveBeenCalledWith(parent);
    });

    it('should resolve wind electricity', async () => {
        const parent: ElectricityParent = {
            position: 1,
            periodStart: '201912232300',
            periodEnd: '201912242300',
            countryCode: countryFixture
        };
        const wind = await resolver.getWindAmount(parent);
        expect(wind).toEqual(11);
    });
});
