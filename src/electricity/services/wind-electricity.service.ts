import { Injectable } from '@nestjs/common';

import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { EntsoeService, Params } from '../../networking/services/entsoe.service';
import { Electricity, ElectricityType } from '../../graphql';

@Injectable()
export class WindElectricityService {

    constructor(private entsoeService: EntsoeService) {
    }

    async getWindOnshoreElectricity({ amount }: Electricity, params: Params): Promise<ElectricityType[]> {
        const solar: EntsoeDtoModel = await this.entsoeService.getWindOnshoreForecast(params).toPromise();
        return solar.GL_MarketDocument.TimeSeries.Period.Point
            .filter(point => (point.position % 4) === 0)
            .map(point => Object.assign({}, {
                amount: point.quantity,
                percentage: (point.quantity / amount) * 100
            }));
    }
}
