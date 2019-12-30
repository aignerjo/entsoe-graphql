import { Exception } from '../../networking/exceptions/exception.model';

import { DayToRangePipe } from './day-to-range.pipe';

describe('DayToRangePipe', () => {

    let parser: DayToRangePipe;

    beforeEach(() => {
        parser = new DayToRangePipe();
    });

    it('should not parse an invalid date', () => {
        try {
            parser.transform('xyz' as any as Date);
            fail();
        } catch (e) {
            expect(e.code).toEqual(Exception.INVALID_DAY);
            expect(e.message).toEqual('Invalid day requested');
        }
    });

    it('should parse a date to a range suitable for entsoe-api', () => {
        const { start, end } = parser.transform(new Date('2019-01-30'));
        expect(start).toEqual('201901292300');
        expect(end).toEqual('201901302300');
    });
});
