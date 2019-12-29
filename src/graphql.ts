
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface Electricity {
    amount?: number;
    timestamp?: Date;
    country?: string;
    mix?: ElectricityMix;
}

export interface ElectricityMix {
    solar?: number;
    wind?: number;
}

export interface IQuery {
    electricity(day?: Date): Electricity[] | Promise<Electricity[]>;
}
