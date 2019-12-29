import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { toApolloError } from 'apollo-server-errors';
import { AxiosError } from 'axios';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost): any {
    if (exception.isAxiosError) {
      const status = exception.response.statusText
        .split(/\s+/)
        .join('_')
        .toUpperCase();
      return toApolloError(exception, status);
    } else {
      return exception;
    }
  }
}
