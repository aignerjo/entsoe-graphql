import { Injectable, NestMiddleware } from '@nestjs/common';

import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {

    constructor(private readonly logger: LoggingService) {
    }

    use(req: any, res: any, next: () => void) {
        if (req.baseUrl === '/health') {
            next();
            return;
        }

        this.logger.logHttpRequest(req, 'incoming');
        next();
    }
}
