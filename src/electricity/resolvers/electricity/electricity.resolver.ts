import { UseFilters } from '@nestjs/common';
import { Args, Context, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { DayToRangePipe, Range } from '../../pipes/day-to-range.pipe';
import { ElectricityService } from '../../services/electricity.service';
import { HttpExceptionFilter } from '../../../networking/exceptions/exception.filter';
import { Electricity, ElectricityType } from '../../../graphql';
import { ParseCountryPipe } from '../../pipes/parse-country.pipe';
import { SolarElectricityLoader } from '../../loaders/solar-electricity.loader';
import { WindOffshoreElectricityLoader } from '../../loaders/wind-offshore-electricity.loader';
import { WindOnshoreElectricityLoader } from '../../loaders/wind-onshore-electricity.loader';

@Resolver('Electricity')
export class ElectricityResolver {

    constructor(private electricityService: ElectricityService,
                private solarElectricityLoader: SolarElectricityLoader,
                private windOffshoreLoader: WindOffshoreElectricityLoader,
                private windOnshoreLoader: WindOnshoreElectricityLoader) {
    }

    @Query('forecast')
    @UseFilters(HttpExceptionFilter)
    async totalForecast(@Args('day', DayToRangePipe) period: Range,
                        @Args('country', ParseCountryPipe) countryCode: string,
                        @Context() context): Promise<Electricity[]> {
        context.params = { period, countryCode };
        return await this.electricityService.getForecast(context.params);
    }

    @ResolveProperty('solar')
    @UseFilters(HttpExceptionFilter)
    async solarForecast(@Parent() parent: Electricity, @Context() context): Promise<ElectricityType> {
        return this.solarElectricityLoader.load({ parent, params: context.params });
    }

    @ResolveProperty('windOnshore')
    @UseFilters(HttpExceptionFilter)
    async windOnshoreForecast(@Parent() parent: Electricity, @Context() context): Promise<ElectricityType> {
        return this.windOnshoreLoader.load({ parent, params: context.params });
    }

    @ResolveProperty('windOffshore')
    @UseFilters(HttpExceptionFilter)
    async windOffshoreForecast(@Parent() parent: Electricity, @Context() context): Promise<ElectricityType> {
        return this.windOffshoreLoader.load({ parent, params: context.params });
    }
}
