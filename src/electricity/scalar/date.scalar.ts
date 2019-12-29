import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { Moment } from 'moment';
import * as moment from 'moment';

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Moment> {
  description = 'Date custom scalar type';

  parseValue(value: string): Moment {
    return moment.parseZone(value);
  }

  serialize(value: Moment): string {
    const date = moment.parseZone(value);
    return date.format();
  }

  parseLiteral(ast: ValueNode): Moment {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }
}
