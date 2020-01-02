
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface Electricity {
    id?: number;
    totalLoad?: number;
    timestamp?: Date;
    solar?: ElectricityType;
    windOffshore?: ElectricityType;
    windOnshore?: ElectricityType;
}

export interface ElectricityType {
    amount?: number;
    percentage?: number;
}

export interface IQuery {
    forecast(day?: Date, country?: string): Electricity[] | Promise<Electricity[]>;
}
