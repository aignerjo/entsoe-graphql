import { UseFilters } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { DayToRangePipe, Range } from '../../pipes/day-to-range.pipe';
import { ElectricityService } from '../../services/electricity.service';
import { HttpExceptionFilter } from '../../../networking/exceptions/exception.filter';
import { Electricity } from '../../../graphql';
import { ParseCountryPipe } from '../../pipes/parse-country.pipe';

@Resolver('Electricity')
export class ElectricityResolver {

    constructor(private electrcityService: ElectricityService) {
    }

    @Query('electricity')
    @UseFilters(HttpExceptionFilter)
    async getElectricity(@Args('day', DayToRangePipe) period: Range,
                         @Args('country', ParseCountryPipe) countryCode: string): Promise<Electricity[]> {
        return this.electrcityService.getElectricity(period, countryCode);
    }
}
