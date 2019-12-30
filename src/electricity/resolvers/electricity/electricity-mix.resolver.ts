import { UseFilters } from '@nestjs/common';
import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { HttpExceptionFilter } from '../../../networking/exceptions/exception.filter';
import { Electricity, ElectricityMix } from '../../../graphql';
import { SolarElectricityService } from '../../services/solar-electricity.service';

@Resolver('ElectricityMix')
export class ElectricityMixResolver {

    constructor(private solarElectrcityService: SolarElectricityService) {
    }

    @ResolveProperty('solar')
    @UseFilters(HttpExceptionFilter)
    async getSolarAmount(@Parent() parent: any): Promise<number> {
        return this.solarElectrcityService.getSolarElectrcity(parent);
    }

    @ResolveProperty('wind')
    @UseFilters(HttpExceptionFilter)
    async getWindAmount(@Parent() parent: Electricity): Promise<number> {
        return Promise.resolve(11);
    }
}
