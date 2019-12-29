import { LoggingService } from '../logging/logging.service';

import { LoggingMiddleware } from './logging.middleware';

describe('RequestIdMiddleware', () => {

    let logger: LoggingService;
    let loggingMiddleware: LoggingMiddleware;

    beforeAll(() => {
        logger = new LoggingService();
        loggingMiddleware = new LoggingMiddleware(logger);
    });

    it('should be defined', () => {
        expect(loggingMiddleware).toBeDefined();
    });

    it('should log requests', () => {
        const spy = spyOn(logger, 'logHttpRequest');
        loggingMiddleware.use({}, {}, () => {
            expect(spy).toHaveBeenCalledWith({}, 'incoming');
        });
    });

    it('should log requests', () => {
        const spy = spyOn(logger, 'logHttpRequest');
        loggingMiddleware.use({ baseUrl: '/health' }, {}, () => {
            expect(spy).not.toHaveBeenCalledWith({}, 'incoming');
        });
    });
});
