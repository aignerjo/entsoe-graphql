import { Kind } from 'graphql';
import * as moment from 'moment';

import { DateScalar } from './date.scalar';

describe('DateScalar', () => {
  let scalar: DateScalar;
  const date = moment.parseZone('2019-07-10T12:27:02Z');

  beforeEach(() => {
    scalar = new DateScalar();
  });

  it('parses string', () => {
    const result = scalar.parseValue('2019-07-10T12:27:02Z');
    expect(result).toEqual(date);
  });

  it('serializes date', () => {
    const result = scalar.serialize(date);
    expect(result).toEqual('2019-07-10T12:27:02Z');
  });

  it('serializes string without timezone', () => {
    const result = scalar.serialize('2019-07-10T12:27:02Z' as any);
    expect(result).toEqual('2019-07-10T12:27:02Z');
  });

  it('serializes string with timezone', () => {
    const result = scalar.serialize('2019-07-10T12:27:02+0200' as any);
    expect(result).toEqual('2019-07-10T12:27:02+02:00');
  });

  it('ast string date is parsed', () => {
    const result = scalar.parseLiteral({ kind: Kind.STRING, value: '2019-07-10T12:27:02Z' });
    expect(result).toEqual(date);
  });

  it('ast bool is not parsed', () => {
    const result = scalar.parseLiteral({ kind: Kind.BOOLEAN, value: true });
    expect(result).toBeNull();
  });
});
