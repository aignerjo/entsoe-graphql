import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import * as moment from 'moment';

export interface Period {
    start: string;
    end: string;
}

@Injectable()
export class ParseDayPipe implements PipeTransform<Date, Period> {

    private readonly TIME = '2300';

    transform(value: Date, metadata: ArgumentMetadata): Period {
        const requestedDay = moment(value);
        if (!requestedDay.isValid()) {
            throw new HttpException('Invalid day requested', HttpStatus.BAD_REQUEST);
        }
        const start = moment(value).subtract(1, 'day').format('YYYYMMDD') + this.TIME;
        const end = moment(value).format('YYYYMMDD') + this.TIME;

        return { start, end };
    }
}
