import { Test, TestingModule } from '@nestjs/testing';

import { SolarElectricityService } from '../../services/solar-electricity.service';

import { ElectricityMixResolver } from './electricity-mix.resolver';

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
});
