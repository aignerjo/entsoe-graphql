import { UseFilters } from '@nestjs/common';
import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { HttpExceptionFilter } from '../../../networking/exceptions/exception.filter';
import { ElectricityMix } from '../../../graphql';
import { SolarElectricityService } from '../../services/solar-electricity.service';

export interface ElectricityParent {
    position: number;
    periodStart: string;
    periodEnd: string;
}

@Resolver('ElectricityMix')
export class ElectricityMixResolver {

    constructor(private solarElectrcityService: SolarElectricityService) {
    }

    @ResolveProperty('solar')
    @UseFilters(HttpExceptionFilter)
    async getSolarAmount(@Parent() parent: ElectricityParent): Promise<number> {
        return this.solarElectrcityService.getSolarElectrcity(parent);
    }

    @ResolveProperty('wind')
    @UseFilters(HttpExceptionFilter)
    async getWindAmount(@Parent() parent: ElectricityParent): Promise<number> {
        return Promise.resolve(11);
    }
}
