import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { NetworkingModule } from '../networking/networking.module';

import { DateScalar } from './scalar/date.scalar';
import { DayToRangePipe } from './pipes/day-to-range.pipe';
import { ElectricityMixResolver } from './resolvers/electricity/electricity-mix.resolver';
import { ElectricityResolver } from './resolvers/electricity/electricity.resolver';
import { ElectricityService } from './services/electricity.service';
import { ParseIntervalPipe } from './pipes/parse-interval.pipe';
import { SolarElectricityService } from './services/solar-electricity.service';

@Module({
    imports: [
        NetworkingModule,
        GraphQLModule.forRoot({
            debug: !!process.env.DEBUG,
            playground: !!process.env.PLAYGROUND,
            typePaths: ['**/electricity/**/*.graphql'],
            context: ({ req }) => req,
        }),
    ],
    providers: [
        ElectricityResolver,
        SolarElectricityService,
        ElectricityService,
        ElectricityMixResolver,
        DateScalar,
        DayToRangePipe,
        ParseIntervalPipe,
    ],
    exports: [
        ElectricityService,
        SolarElectricityService,
    ]
})

export class ElectricityModule {
}
