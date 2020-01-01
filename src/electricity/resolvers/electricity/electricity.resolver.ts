import { UseFilters } from '@nestjs/common';
import { Args, Context, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { DayToRangePipe, Range } from '../../pipes/day-to-range.pipe';
import { ElectricityService } from '../../services/electricity.service';
import { HttpExceptionFilter } from '../../../networking/exceptions/exception.filter';
import { Electricity, ElectricityType } from '../../../graphql';
import { ParseCountryPipe } from '../../pipes/parse-country.pipe';
import { SolarElectricityService } from '../../services/solar-electricity.service';

@Resolver('Electricity')
export class ElectricityResolver {

    constructor(private electricityService: ElectricityService,
                private solarElectricityService: SolarElectricityService) {
    }

    @Query('electricity')
    @UseFilters(HttpExceptionFilter)
    async getElectricity(@Args('day', DayToRangePipe) period: Range,
                         @Args('country', ParseCountryPipe) countryCode: string,
                         @Context() context): Promise<Electricity[]> {
        context.params = { period, countryCode };
        return await this.electricityService.getElectricity(context.params);
    }

    @ResolveProperty('solar')
    @UseFilters(HttpExceptionFilter)
    async getSolarAmount(@Parent() parent: Electricity, @Context() context): Promise<ElectricityType> {
        return this.solarElectricityService.getSolarElectricity(parent, context.params);
    }

    @ResolveProperty('wind')
    @UseFilters(HttpExceptionFilter)
    async getWindAmount(@Parent() parent: Electricity,
                        @Args('day', DayToRangePipe) period: Range,
                        @Args('country', ParseCountryPipe) countryCode: string): Promise<number> {
        return Promise.resolve(11);
    }
}
