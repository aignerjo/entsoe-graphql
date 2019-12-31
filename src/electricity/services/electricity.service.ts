import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { Range } from '../pipes/day-to-range.pipe';
import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { EntsoeService } from '../../networking/services/entsoe.service';
import { Electricity } from '../../graphql';
import { ParseIntervalPipe } from '../pipes/parse-interval.pipe';

@Injectable()
export class ElectricityService {

    constructor(private entsoeService: EntsoeService, private parseInterval: ParseIntervalPipe) {
    }

    async getElectricity({ start, end }: Range, countryCode: string): Promise<Electricity[]> {
        const electricity: EntsoeDtoModel = await this.entsoeService.getElectricity(start, end, countryCode).toPromise();

        const interval = this.parseInterval.transform(electricity.GL_MarketDocument.TimeSeries.Period.resolution);
        const intervalStart = electricity.GL_MarketDocument.TimeSeries.Period.timeInterval.start;

        return electricity.GL_MarketDocument.TimeSeries.Period.Point.map((point, index) => {
            const timestamp = moment(intervalStart).add(interval * index, 'minutes').toDate();
            return Object.assign({}, {
                timestamp,
                amount: point.quantity,
                mix: {
                    countryCode,
                    periodStart: start,
                    periodEnd: end,
                    position: point.position,
                },
            }) as Electricity;
        });
    }
}
