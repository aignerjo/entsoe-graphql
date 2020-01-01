import { Exception } from '../../networking/exceptions/exception.model';

import { ParseIntervalPipe } from './parse-interval.pipe';

describe('ParseIntervalPipe', () => {

    let parser: ParseIntervalPipe;

    beforeEach(() => {
        parser = new ParseIntervalPipe();
    });

    it('should not parse an invalid string with not numbers in it', () => {
        try {
            parser.transform('xyz');
            fail();
        } catch (e) {
            expect(e.code).toEqual(Exception.INVALID_TIME_INTERVAL);
            expect(e.message).toEqual('Invalid time interval received from entsoe');
        }
    });

    it('should parse a date to a range suitable for entsoe-api', () => {
        const interval = parser.transform('PT60M');
        expect(interval).toEqual(60);
    });

    it('should not parse undefined', () => {
        try {
            parser.transform(undefined);
            fail();
        } catch (e) {
            expect(e.code).toEqual(Exception.INVALID_TIME_INTERVAL);
            expect(e.message).toEqual('Invalid time interval received from entsoe');
        }
    });
});
