import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { Range } from '../pipes/day-to-range.pipe';
import { EntsoeDtoModel } from '../../networking/models/entsoe-dto.model';
import { EntsoeService } from '../../networking/services/entsoe.service';
import { Electricity } from '../../graphql';

@Injectable()
export class ElectricityService {

    constructor(private entsoeService: EntsoeService) {
    }

    async getElectricity({ start, end }: Range): Promise<Electricity[]> {
        const electricity: EntsoeDtoModel = await this.entsoeService.getElectricity(start, end).toPromise();
        const interval = 60; // TODO: get from electricity.GL_MarketDocument.TimeSeries.Range.resolution;
        const intervalStart = electricity.GL_MarketDocument.TimeSeries.Period.timeInterval.start;

        return electricity.GL_MarketDocument.TimeSeries.Period.Point.map((point, index) => {
            const timestamp = moment(intervalStart).add(interval * index, 'minutes').toDate();
            return Object.assign({}, {
                timestamp,
                country: 'DE', // TODO: get from electricity response
                amount: point.quantity,
                mix: {
                    periodStart: start,
                    periodEnd: end,
                    position: point.position,
                },
            }) as Electricity;
        });
    }
}
