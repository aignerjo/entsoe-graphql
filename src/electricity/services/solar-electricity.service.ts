import { Injectable } from '@nestjs/common';

import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { DocumentType, ParseType, ProcessType } from '../../networking/constants/entsoe.constants';
import { EntsoeService, Params } from '../../networking/services/entsoe.service';
import { Electricity, ElectricityType } from '../../graphql';

@Injectable()
export class SolarElectricityService {

    constructor(private entsoeService: EntsoeService) {
    }

    async getSolarElectricity({ totalLoad }: Electricity, params: Params): Promise<ElectricityType[]> {
        Object.assign(params, {
            documentType: DocumentType.windAndSolarForecast,
            processType: ProcessType.dayAhead,
            psrType: ParseType.solar
        });
        const solar = await this.entsoeService.get<EntsoeDtoModel>(params).toPromise();
        return solar.GL_MarketDocument.TimeSeries.Period.Point
            .map(point => Object.assign({}, {
                amount: point.quantity,
                percentage: (point.quantity / totalLoad) * 100
            }));
    }
}
