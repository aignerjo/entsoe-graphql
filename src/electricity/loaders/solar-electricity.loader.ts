import * as DataLoader from 'dataloader';

import { Params } from '../../networking/services/entsoe.service';
import { Electricity, ElectricityType } from '../../graphql';
import { SolarElectricityService } from '../services/solar-electricity.service';

import { IDataLoader } from './data-loader.interface';

interface Context<T> {
    params: Params;
    parent: T;
}

export class SolarElectricityLoader implements IDataLoader<Context<Electricity>, ElectricityType> {
    constructor(private readonly dataLoader: DataLoader<Context<Electricity>, ElectricityType>) {
    }

    public static async create(solarService: SolarElectricityService): Promise<SolarElectricityLoader> {
        const dataLoader = new DataLoader<Context<Electricity>, ElectricityType>(async keys => {
            const parent: Electricity = keys.map(arg => arg.parent)[0];
            const params = keys.map(arg => arg.params)[0];
            return solarService.getSolarElectricity(parent, params);
        });

        return new SolarElectricityLoader(dataLoader);
    }

    public async load(context: Context<Electricity>): Promise<ElectricityType> {
        return this.dataLoader.load(context);
    }
}
