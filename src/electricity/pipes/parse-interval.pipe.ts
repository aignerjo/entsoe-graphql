import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { Exception } from '../../networking/exceptions/exception.model';

@Injectable()
export class ParseIntervalPipe implements PipeTransform<string, number> {

    transform(value: string, metadata?: ArgumentMetadata): number {
        if (!value) {
            ParseIntervalPipe.throwCouldNotParseError();
        }

        const numbers = value.match(/\d+/g);

        if (!numbers || numbers.length < 1) {
            ParseIntervalPipe.throwCouldNotParseError();
        }

        return parseInt(numbers[0], 10);
    }

    private static throwCouldNotParseError() {
        throw new Exception({
            message: 'Invalid time interval received from entsoe',
            code: Exception.INVALID_TIME_INTERVAL
        });
    }
}
