import { Test, TestingModule } from '@nestjs/testing';

import { Range } from '../pipes/day-to-range.pipe';
import { SolarElectricityService } from '../services/solar-electricity.service';

import { SolarElectricityLoader } from './solar-electricity.loader';

describe('SolarElectricityLoader', () => {
    let loader: SolarElectricityLoader;
    let service: SolarElectricityService;

    const parentFixture = { id: 1, amount: 100 };
    const rangeFixture: Range = { start: '201912232300', end: '201912242300' };
    const countryFixture = '10Y1001A1001A83F';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SolarElectricityLoader,
                {
                    provide: SolarElectricityService,
                    useValue: {
                        getSolarElectricity: () => Promise.resolve([{ id: 1 }]),
                    }
                },
            ],
        }).compile();

        service = module.get<SolarElectricityService>(SolarElectricityService);
        loader = await SolarElectricityLoader.create(service);
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
