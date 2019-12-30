import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as moment from 'moment';

import { Exception } from '../../networking/exceptions/exception.model';

export interface Range {
    start: string;
    end: string;
}

@Injectable()
export class DayToRangePipe implements PipeTransform<Date, Range> {

    private readonly TIME = '2300';

    transform(value: Date, metadata?: ArgumentMetadata): Range {
        const requestedDay = moment(value, moment.ISO_8601);

        if (!requestedDay.isValid()) {
            throw new Exception({ message: 'Invalid day requested', code: Exception.INVALID_DAY });
        }
        const start = moment(value).subtract(1, 'day').format('YYYYMMDD') + this.TIME;
        const end = moment(value).format('YYYYMMDD') + this.TIME;

        return { start, end };
    }
}
