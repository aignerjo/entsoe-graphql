import { Injectable } from '@nestjs/common';

import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { EntsoeService } from '../../networking/services/entsoe.service';

@Injectable()
export class SolarElectricityService {

    constructor(private entsoeService: EntsoeService) {
    }

    async getSolarElectricity({ position, periodStart, periodEnd, countryCode }): Promise<number> {
        const solar: EntsoeDtoModel = await this.entsoeService.getSolarForecast(periodStart, periodEnd, countryCode).toPromise();
        return solar.GL_MarketDocument.TimeSeries.Period.Point
            .filter(point => (point.position / 4) === position)
            .map(point => point.quantity)[0];
    }
}
