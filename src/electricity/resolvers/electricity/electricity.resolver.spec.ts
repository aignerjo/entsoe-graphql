import { Test, TestingModule } from '@nestjs/testing';

import { ElectricityService } from '../../services/electricity.service';

import { ElectricityResolver } from './electricity.resolver';

describe('ElectricityResolver', () => {
    let resolver: ElectricityResolver;
    let service: ElectricityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ElectricityResolver,
                { provide: ElectricityService, useValue: { getElectricity: () => null } },
            ],
        }).compile();

        resolver = module.get<ElectricityResolver>(ElectricityResolver);
        service = module.get<ElectricityService>(ElectricityService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
