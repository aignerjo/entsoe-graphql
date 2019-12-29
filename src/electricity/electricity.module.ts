import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { NetworkingModule } from '../networking/networking.module';

import { DateScalar } from './scalar/date.scalar';
import { ElectricityMixResolver } from './resolvers/electricity/electricity-mix.resolver';
import { ElectricityResolver } from './resolvers/electricity/electricity.resolver';
import { ParseDayPipe } from './pipes/parse-day.pipe';

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
        ParseDayPipe,
    ],
})

export class ElectricityModule {
}
