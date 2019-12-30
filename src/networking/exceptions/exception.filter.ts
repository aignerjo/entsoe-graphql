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

        if (exception.code === Exception.INVALID_DAY) {
            return new HttpException('Invalid day requested', HttpStatus.BAD_REQUEST);
        }

        return exception;
    }
}
