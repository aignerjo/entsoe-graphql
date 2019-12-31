import { Test, TestingModule } from '@nestjs/testing';

import { Range } from '../../pipes/day-to-range.pipe';
import { ElectricityService } from '../../services/electricity.service';

import { ElectricityResolver } from './electricity.resolver';

describe('ElectricityResolver', () => {
    let resolver: ElectricityResolver;
    let service: ElectricityService;

    const countryFixture = 'DE';

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

    it('should resolve solar electricity', async () => {
        const spy = spyOn(service, 'getElectricity');
        const period: Range = {
            start: '201912232300',
            end: '201912242300'
        };
        await resolver.getElectricity(period, countryFixture);
        expect(spy).toHaveBeenCalledWith(period, countryFixture);
    });
});
