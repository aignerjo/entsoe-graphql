import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AxiosFactory } from './factories/axios.factory';
import { ENTSOE_API_URL, ENTSOE_SECURITY_TOKEN, EntsoeService } from './services/entsoe.service';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { LoggingService } from './logging/logging.service';

@Module({
    imports: [
        HttpModule.registerAsync({
            useClass: AxiosFactory,
        }),
    ],
    providers: [
        LoggingService,
        EntsoeService,
        { provide: ENTSOE_API_URL, useValue: process.env[ENTSOE_API_URL] },
        { provide: ENTSOE_SECURITY_TOKEN, useValue: process.env[ENTSOE_SECURITY_TOKEN] },
    ],
    exports: [
        HttpModule, EntsoeService, LoggingService,
    ],
})

export class NetworkingModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggingMiddleware)
            .forRoutes('*');
    }
}
