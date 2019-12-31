
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface Electricity {
    amount?: number;
    timestamp?: Date;
    mix?: ElectricityMix;
}

export interface ElectricityMix {
    solar?: number;
    wind?: number;
}

export interface IQuery {
    electricity(day?: Date, country?: string): Electricity[] | Promise<Electricity[]>;
}
