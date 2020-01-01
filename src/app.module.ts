import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ElectricityModule } from './electricity/electricity.module';
import { ElectricityResolver } from './electricity/resolvers/electricity/electricity.resolver';
import { NetworkingModule } from './networking/networking.module';

@Module({
    imports: [
        NetworkingModule,
        ElectricityModule,
    ],
    controllers: [AppController],
    providers: [
        ElectricityResolver,
    ],
})
export class AppModule {
}
