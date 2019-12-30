import { HttpModule, HttpService, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

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
        HttpService,
        EntsoeService,
        { provide: ENTSOE_API_URL, useValue: process.env[ENTSOE_API_URL] },
        { provide: ENTSOE_SECURITY_TOKEN, useValue: process.env[ENTSOE_SECURITY_TOKEN] },
    ],
    exports: [
        HttpModule, EntsoeService, LoggingService,
    ],
})

export class NetworkingModule implements NestModule {

    constructor(private httpClient: HttpService, private logger: LoggingService) {
        this.initHttpInterceptor();
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggingMiddleware)
            .forRoutes('*');
    }

    private initHttpInterceptor() {
        this.httpClient.axiosRef.interceptors.request.use((request) => {
            this.logger.logHttpRequest(request, 'outgoing');
            if (request.method === 'get') {
                delete request.headers['content-length'];
            }
            return request;
        });

        this.httpClient.axiosRef.interceptors.response.use((response) => {
            this.logger.logHttpResponse(response);
            return response;
        });
    }
}
