import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { toApolloError } from 'apollo-server-errors';
import { AxiosError } from 'axios';

import { Exception } from './exception.model';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: AxiosError, host: ArgumentsHost): any {

        if (exception.isAxiosError) {
            const status = exception.response.statusText
                .split(/\s+/)
                .join('_')
                .toUpperCase();
            return toApolloError(exception, status);
        }

        switch (exception.code) {
            case Exception.INVALID_DAY:
                return new HttpException('Invalid day requested', HttpStatus.BAD_REQUEST);
            case Exception.INVALID_TIME_INTERVAL:
                return new HttpException('Invalid time interval received', HttpStatus.BAD_REQUEST);
            case Exception.INVALID_COUNTRY_PROVIDED:
                return new HttpException('Not yet implemented', HttpStatus.NOT_IMPLEMENTED);
        }

        return exception;
    }
}
