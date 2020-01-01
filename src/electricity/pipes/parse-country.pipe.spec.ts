import { Exception } from '../../networking/exceptions/exception.model';

import { Country, ParseCountryPipe } from './parse-country.pipe';

describe('ParseCountryPipe', () => {

    let parser: ParseCountryPipe;

    beforeEach(() => {
        parser = new ParseCountryPipe();
    });

    it('should not parse an invalid country', () => {
        try {
            parser.transform('xyz');
            fail();
        } catch (e) {
            expect(e.code).toEqual(Exception.INVALID_COUNTRY_PROVIDED);
        }
    });

    it('should parse a valid country to a countryCode', () => {
        const interval = parser.transform('DE');
        expect(interval).toEqual(Country.DE);
    });
});
