import * as DataLoader from 'dataloader';

import { Params } from '../../networking/services/entsoe.service';
import { Electricity, ElectricityType } from '../../graphql';
import { WindElectricityService } from '../services/wind-electricity.service';

import { IDataLoader } from './data-loader.interface';

interface Context<T> {
    params: Params;
    parent: T;
}

export class WindOffshoreElectricityLoader implements IDataLoader<Context<Electricity>, ElectricityType> {
    constructor(private readonly dataLoader: DataLoader<Context<Electricity>, ElectricityType>) {
    }

    public static async create(service: WindElectricityService): Promise<WindOffshoreElectricityLoader> {
        const dataLoader = new DataLoader<Context<Electricity>, ElectricityType>(async keys => {
            const parent: Electricity = keys.map(arg => arg.parent)[0];
            const params = keys.map(arg => arg.params)[0];
            return service.getWindOffshoreElectricity(parent, params);
        });

        return new WindOffshoreElectricityLoader(dataLoader);
    }

    public async load(context: Context<Electricity>): Promise<ElectricityType> {
        return this.dataLoader.load(context);
    }
}
