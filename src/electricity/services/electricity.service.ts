import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { DocumentType, ProcessType } from '../../networking/constants/entsoe.constants';
import { EntsoeService, Params } from '../../networking/services/entsoe.service';
import { Electricity } from '../../graphql';
import { ParseIntervalPipe } from '../pipes/parse-interval.pipe';

@Injectable()
export class ElectricityService {

    constructor(private entsoeService: EntsoeService, private parseInterval: ParseIntervalPipe) {
    }

    async getForecast(params: Params): Promise<Electricity[]> {

        Object.assign(params, {
            documentType: DocumentType.totalLoad,
            processType: ProcessType.dayAhead
        });
        const electricity = await this.entsoeService.get<EntsoeDtoModel>(params).toPromise();

        const interval = this.parseInterval.transform(electricity.GL_MarketDocument.TimeSeries.Period.resolution);
        const intervalStart = electricity.GL_MarketDocument.TimeSeries.Period.timeInterval.start;

        return electricity.GL_MarketDocument.TimeSeries.Period.Point.map((point, index) => {
            const timestamp = moment(intervalStart).add(interval * index, 'minutes').toDate();
            return Object.assign({}, {
                timestamp,
                totalLoad: point.quantity,
                id: point.position
            }) as Electricity;
        });
    }
}
