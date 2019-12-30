import { Test, TestingModule } from '@nestjs/testing';

import { EntsoeService } from '../../networking/services/entsoe.service';

import { ElectricityService } from './electricity.service';

describe('ElectricityService', () => {
    let service: ElectricityService;
    let apiService: EntsoeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElectricityService,
                { provide: EntsoeService, useValue: { getSolarForecast: () => null, getElectricity: () => null } },
            ],
        }).compile();

        apiService = module.get<EntsoeService>(EntsoeService);
        service = module.get<ElectricityService>(ElectricityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
