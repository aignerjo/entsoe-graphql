import { UseFilters } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import * as moment from 'moment';

import { EntsoeDtoModel } from '../../../networking/models/entsoe-dto.model';
import { EntsoeService } from '../../../networking/services/entsoe.service';
import { HttpExceptionFilter } from '../../../networking/exceptions/exception.filter';
import { Electricity } from '../../../graphql';
import { ParseDayPipe, Period } from '../../pipes/parse-day.pipe';

@Resolver('Electricity')
export class ElectricityResolver {

    constructor(private entsoeService: EntsoeService) {
    }

    @Query('electricity')
    @UseFilters(HttpExceptionFilter)
    async getElectricity(@Args('day', ParseDayPipe) period: Period): Promise<Electricity[]> {
        const electricity: EntsoeDtoModel = await this.entsoeService.getElectricity(period.start, period.end).toPromise();
        const interval = 60; // TODO: get from electricity.GL_MarketDocument.TimeSeries.Period.resolution;
        const intervalStart = electricity.GL_MarketDocument.TimeSeries.Period.timeInterval.start;

        return electricity.GL_MarketDocument.TimeSeries.Period.Point.map((point, index) => {
            const timestamp = moment(intervalStart).add(interval * index, 'minutes').toDate();
            return Object.assign({}, {
                timestamp,
                country: 'DE', // TODO: get from electricity response
                amount: point.quantity,
                mix: {
                    periodStart: period.start,
                    periodEnd: period.end,
                    position: point.position,
                },
            }) as Electricity;
        });
    }
}
