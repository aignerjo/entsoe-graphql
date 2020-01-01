
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface Electricity {
    id?: number;
    amount?: number;
    timestamp?: Date;
    solar?: ElectricityType;
    wind?: ElectricityType;
}

export interface ElectricityType {
    amount?: number;
    percentage?: number;
}

export interface IQuery {
    electricity(day?: Date, country?: string): Electricity[] | Promise<Electricity[]>;
}
