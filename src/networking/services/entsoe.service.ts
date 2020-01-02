import { HttpService, Inject, Injectable, Optional } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import * as parse from 'fast-xml-parser';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Range } from '../../electricity/pipes/day-to-range.pipe';
import { HttpMethod } from '../../../test/http-service-mock';
import { LoggingService } from '../logging/logging.service';

export const ENTSOE_API_URL = 'ENTSOE_API_URL';
export const ENTSOE_SECURITY_TOKEN = 'ENTSOE_SECURITY_TOKEN';

export interface Params {
    countryCode?: string;
    period?: Range;
    documentType?: string;
    psrType?: string;
    processType?: string;
}

export interface EntsoeParams {
    securityToken?: string;
    documentType?: string;
    psrType?: string;
    processType?: string;
    in_Domain?: string;
    outbiddingZone_Domain?: string;
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

    get<T>({ documentType, processType, psrType, countryCode, period }: Params): Observable<T> {
        const request: AxiosRequestConfig = this.generateRequest(HttpMethod.GET, {
            documentType,
            processType,
            psrType,
            in_Domain: countryCode,
            outbiddingZone_Domain: countryCode,
            periodStart: period.start,
            periodEnd: period.end
        });

        return this.httpClient.request<any>(request).pipe(
            tap(() => this.logger.logHttpRequest(request, 'outgoing')),
            tap((res) => this.logger.logHttpResponse(res)),
            map(res => parse.parse(res.data) as T));
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
