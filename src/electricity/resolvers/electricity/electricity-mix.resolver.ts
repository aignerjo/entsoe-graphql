import { UseFilters } from '@nestjs/common';
import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { EntsoeDtoModel } from '../../../networking/models/entsoe-dto.model';
import { EntsoeService } from '../../../networking/services/entsoe.service';
import { HttpExceptionFilter } from '../../../networking/exceptions/exception.filter';
import { Electricity, ElectricityMix } from '../../../graphql';

@Resolver('ElectricityMix')
export class ElectricityMixResolver {

    constructor(private entseoService: EntsoeService) {
    }

    @ResolveProperty('solar')
    @UseFilters(HttpExceptionFilter)
    async getSolarAmount(@Parent() parent: any): Promise<number> {
        const position = parent.position;
        const periodStart = parent.periodStart;
        const periodEnd = parent.periodEnd;
        const solar: EntsoeDtoModel = await this.entseoService.getSolarForecast(periodStart, periodEnd).toPromise();
        return solar.GL_MarketDocument.TimeSeries.Period.Point
            .filter(point => (point.position / 4) === position)
            .map(point => point.quantity)[0];
    }

    @ResolveProperty('wind')
    @UseFilters(HttpExceptionFilter)
    async getWindAmount(@Parent() parent: Electricity): Promise<number> {
        return Promise.resolve(11);
    }
}
