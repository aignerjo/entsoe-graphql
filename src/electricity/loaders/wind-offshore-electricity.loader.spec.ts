import { Test, TestingModule } from '@nestjs/testing';

import { Range } from '../pipes/day-to-range.pipe';
import { WindElectricityService } from '../services/wind-electricity.service';

import { WindOffshoreElectricityLoader } from './wind-offshore-electricity.loader';

describe('WindOffshoreElectricityLoader', () => {
    let loader: WindOffshoreElectricityLoader;
    let service: WindElectricityService;

    const parentFixture = { id: 1, amount: 100 };
    const rangeFixture: Range = { start: '201912232300', end: '201912242300' };
    const countryFixture = '10Y1001A1001A83F';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WindOffshoreElectricityLoader,
                {
                    provide: WindElectricityService,
                    useValue: {
                        getWindOffshoreElectricity: () => Promise.resolve([{ id: 1 }]),
                    }
                },
            ],
        }).compile();

        service = module.get<WindElectricityService>(WindElectricityService);
        loader = await WindOffshoreElectricityLoader.create(service);
    });

    it('should correctly init the dataloader', async () => {
        expect(loader).toBeDefined();
    });

    it('should load correctly', async () => {
        await loader.load({
            ...parentFixture,
            params: { period: rangeFixture, countryCode: countryFixture }
        } as any);

    });

});
