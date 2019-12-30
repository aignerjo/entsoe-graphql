import { Injectable } from '@nestjs/common';

import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { EntsoeService } from '../../networking/services/entsoe.service';

@Injectable()
export class SolarElectricityService {

    constructor(private entsoeService: EntsoeService) {
    }

    async getSolarElectrcity({ position, periodStart, periodEnd }: any): Promise<number> {
        const solar: EntsoeDtoModel = await this.entsoeService.getSolarForecast(periodStart, periodEnd).toPromise();
        return solar.GL_MarketDocument.TimeSeries.Period.Point
            .filter(point => (point.position / 4) === position)
            .map(point => point.quantity)[0];
    }
}
