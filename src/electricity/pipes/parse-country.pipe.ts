import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { Exception } from '../../networking/exceptions/exception.model';

export enum Country {
    'DE' = '10Y1001A1001A83F'
}

@Injectable()
export class ParseCountryPipe implements PipeTransform<string, string> {

    transform(value: string, metadata?: ArgumentMetadata): string {
        const countryCode = Country[value];

        if (!countryCode) {
            throw new Exception({ message: 'Invalid country provided', code: Exception.INVALID_COUNTRY_PROVIDED });
        }

        return countryCode;
    }
}
