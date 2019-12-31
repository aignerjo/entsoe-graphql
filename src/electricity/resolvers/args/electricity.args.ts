import { ArgsType } from 'type-graphql';

@ArgsType()
export class ElectricityArgs {
    day?: Date;
    country: string;
}
