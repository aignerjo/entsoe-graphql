import { Test, TestingModule } from '@nestjs/testing';

import { EntsoeService } from '../../networking/services/entsoe.service';

import { SolarElectricityService } from './solar-electricity.service';

describe('SolarElectricityService', () => {
    let service: SolarElectricityService;
    let apiService: EntsoeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SolarElectricityService,
                { provide: EntsoeService, useValue: { getSolarForecast: () => null, getElectricity: () => null } },
            ],
        }).compile();

        apiService = module.get<EntsoeService>(EntsoeService);
        service = module.get<SolarElectricityService>(SolarElectricityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
