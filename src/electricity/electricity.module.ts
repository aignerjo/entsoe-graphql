import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { NetworkingModule } from '../networking/networking.module';

import { DateScalar } from './scalar/date.scalar';
import { DayToRangePipe } from './pipes/day-to-range.pipe';
import { ElectricityMixResolver } from './resolvers/electricity/electricity-mix.resolver';
import { ElectricityResolver } from './resolvers/electricity/electricity.resolver';

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
        ElectricityMixResolver,
        DateScalar,
        DayToRangePipe,
    ],
})

export class ElectricityModule {
}
