import { Test, TestingModule } from '@nestjs/testing';

import { SolarElectricityService } from '../../services/solar-electricity.service';

import { ElectricityMixResolver, ElectricityParent } from './electricity-mix.resolver';

describe('ElectricityMixResolver', () => {
    let resolver: ElectricityMixResolver;
    let solarElectrcityService: SolarElectricityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElectricityMixResolver,
                { provide: SolarElectricityService, useValue: { getSolarElectrcity: () => null } },
            ],
        }).compile();

        resolver = module.get<ElectricityMixResolver>(ElectricityMixResolver);
        solarElectrcityService = module.get<SolarElectricityService>(SolarElectricityService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should resolve solar electricity', async () => {
        const spy = spyOn(solarElectrcityService, 'getSolarElectrcity');
        const parent: ElectricityParent = {
            position: 1,
            periodStart: '201912232300',
            periodEnd: '201912242300'
        };
        await resolver.getSolarAmount(parent);
        expect(spy).toHaveBeenCalledWith(parent);
    });

    it('should resolve wind electricity', async () => {
        const parent: ElectricityParent = {
            position: 1,
            periodStart: '201912232300',
            periodEnd: '201912242300'
        };
        const wind = await resolver.getWindAmount(parent);
        expect(wind).toEqual(11);
    });
});
