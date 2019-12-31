import { HttpService, Inject, Injectable, Optional } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import * as parse from 'fast-xml-parser';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { EntsoeDtoModel } from '../models/entsoe-dto.model';
import { DocumentType, ParseType, ProcessType } from '../constants/entsoe.constants';
import { HttpMethod } from '../../../test/http-service-mock';
import { LoggingService } from '../logging/logging.service';

export const ENTSOE_API_URL = 'ENTSOE_API_URL';
export const ENTSOE_SECURITY_TOKEN = 'ENTSOE_SECURITY_TOKEN';

export interface EntsoeParams {
    securityToken?: string;
    documentType?: string;
    psrType?: string;
    processType?: string;
    in_Domain?: string;
    periodStart?: string;
    periodEnd?: string;
}

@Injectable()
export class EntsoeService {

    constructor(private httpClient: HttpService,
                private logger: LoggingService,
                @Optional() @Inject(ENTSOE_API_URL) private baseUrl: string,
                @Optional() @Inject(ENTSOE_SECURITY_TOKEN) private securityToken: string) {
        if (this.baseUrl === null) {
            throw new Error('The environment variable ENTSOE_API_URL is not set.');
        }
        if (this.securityToken === null) {
            throw new Error('The environment variable ENTSOE_SECURITY_TOKEN is not set.');
        }
    }

    getSolarForecast(periodStart: string, periodEnd: string, countryCode: string): Observable<any> {
        const request: AxiosRequestConfig = this.generateRequest(HttpMethod.GET, {
            psrType: ParseType.solar,
            processType: ProcessType.dayAhead,
            documentType: DocumentType.windAndSolarForecast,
            in_Domain: countryCode,
            periodStart,
            periodEnd,
        });

        return this.httpClient.request<any>(request).pipe(
            tap(() => this.logger.logHttpRequest(request, 'outgoing')),
            map(res => parse.parse(res.data) as EntsoeDtoModel),
            tap((res) => this.logger.logHttpResponse(res)));

    }

    getElectricity(periodStart: string, periodEnd: string, countryCode: string): Observable<any> {
        const request: AxiosRequestConfig = this.generateRequest(HttpMethod.GET, {
            periodStart,
            periodEnd,
            processType: ProcessType.dayAhead,
            documentType: DocumentType.generationForecast,
            in_Domain: countryCode
        });

        return this.httpClient.request<any>(request).pipe(
            tap(() => this.logger.logHttpRequest(request, 'outgoing')),
            map(res => parse.parse(res.data) as EntsoeDtoModel),
            tap((res) => this.logger.logHttpResponse(res)));
    }

    private generateRequest(method: HttpMethod, entsoeParams: EntsoeParams): AxiosRequestConfig {
        return Object.assign(
            {} as AxiosRequestConfig,
            { baseURL: this.baseUrl, method },
            {
                params: Object.assign(entsoeParams, { securityToken: this.securityToken })
            });
    }
}
