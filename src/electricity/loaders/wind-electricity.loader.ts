import * as DataLoader from 'dataloader';

import { Params } from '../../networking/services/entsoe.service';
import { Electricity, ElectricityType } from '../../graphql';
import { WindElectricityService } from '../services/wind-electricity.service';

import { IDataLoader } from './data-loader.interface';

interface Context<T> {
    params: Params;
    parent: T;
}

export class WindElectricityLoader implements IDataLoader<Context<Electricity>, ElectricityType> {
    constructor(private readonly dataLoader: DataLoader<Context<Electricity>, ElectricityType>) {
    }

    public static async create(service: WindElectricityService): Promise<WindElectricityLoader> {
        const dataLoader = new DataLoader<Context<Electricity>, ElectricityType>(async keys => {
            const parent: Electricity = keys.map(arg => arg.parent)[0];
            const params = keys.map(arg => arg.params)[0];
            const onshore = await service.getWindOnshoreElectricity(parent, params);
            const offshore = await service.getWindOffshoreElectricity(parent, params);
            return onshore.map((entry, index) => {
                return {
                    amount: entry.amount + offshore[index].amount,
                    percentage: entry.percentage + offshore[index].percentage
                };
            });
        });

        return new WindElectricityLoader(dataLoader);
    }

    public async load(context: Context<Electricity>): Promise<ElectricityType> {
        return this.dataLoader.load(context);
    }
}
