import { Injectable } from '@nestjs/common';

import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { DocumentType, ParseType, ProcessType } from '../../networking/constants/entsoe.constants';
import { EntsoeService, Params } from '../../networking/services/entsoe.service';
import { Electricity, ElectricityType } from '../../graphql';

@Injectable()
export class WindElectricityService {

    constructor(private entsoeService: EntsoeService) {
    }

    async getWindOnshoreElectricity({ totalLoad }: Electricity, params: Params): Promise<ElectricityType[]> {
        Object.assign(params, {
            documentType: DocumentType.windAndSolarForecast,
            psrType: ParseType.windOnshore,
            processType: ProcessType.dayAhead
        });

        const data = await this.entsoeService.get<EntsoeDtoModel>(params).toPromise();
        return data.GL_MarketDocument.TimeSeries.Period.Point
            .map(point => Object.assign({}, {
                amount: point.quantity,
                percentage: (point.quantity / totalLoad) * 100
            }));
    }

    async getWindOffshoreElectricity({ totalLoad }: Electricity, params: Params): Promise<ElectricityType[]> {
        Object.assign(params, {
            documentType: DocumentType.windAndSolarForecast,
            psrType: ParseType.windOffshore,
            processType: ProcessType.dayAhead
        });

        const data = await this.entsoeService.get<EntsoeDtoModel>(params).toPromise();
        return data.GL_MarketDocument.TimeSeries.Period.Point
            .map(point => Object.assign({}, {
                amount: point.quantity,
                percentage: (point.quantity / totalLoad) * 100
            }));
    }
}
