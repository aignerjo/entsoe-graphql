import { Module, Scope } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { NetworkingModule } from '../networking/networking.module';

import { DateScalar } from './scalar/date.scalar';
import { DayToRangePipe } from './pipes/day-to-range.pipe';
import { ElectricityResolver } from './resolvers/electricity/electricity.resolver';
import { ElectricityService } from './services/electricity.service';
import { ParseCountryPipe } from './pipes/parse-country.pipe';
import { ParseIntervalPipe } from './pipes/parse-interval.pipe';
import { SolarElectricityLoader } from './loaders/solar-electricity.loader';
import { SolarElectricityService } from './services/solar-electricity.service';
import { WindElectricityLoader } from './loaders/wind-electricity.loader';
import { WindElectricityService } from './services/wind-electricity.service';

@Module({
    imports: [
        NetworkingModule,
        GraphQLModule.forRoot({
            debug: !!process.env.DEBUG,
            playground: !!process.env.PLAYGROUND,
            typePaths: ['**/electricity/**/*.graphql'],
            context: ({ req, params }) => ({ req, params }),
        }),
    ],
    providers: [
        ElectricityResolver,
        SolarElectricityService,
        WindElectricityService,
        ElectricityService,
        DateScalar,
        DayToRangePipe,
        ParseIntervalPipe,
        ParseCountryPipe,
        {
            inject: [SolarElectricityService],
            provide: SolarElectricityLoader,
            useFactory: SolarElectricityLoader.create,
            scope: Scope.REQUEST,
        },
        {
            inject: [WindElectricityService],
            provide: WindElectricityLoader,
            useFactory: WindElectricityLoader.create,
            scope: Scope.REQUEST,
        }
    ],
    exports: [
        ElectricityService,
        SolarElectricityLoader,
        SolarElectricityService,
        WindElectricityLoader,
        WindElectricityService
    ]
})

export class ElectricityModule {
}
