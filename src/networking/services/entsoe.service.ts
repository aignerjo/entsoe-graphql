import { HttpService, Inject, Injectable, Optional } from '@nestjs/common';
import * as parse from 'fast-xml-parser';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EntsoeDtoModel } from '../models/entsoe-dto.model';
import { DocumentType, Location, ParseType, ProcessType } from '../constants/entsoe.constants';
import { LoggingService } from '../logging/logging.service';

export const ENTSOE_API_URL = 'ENTSOE_API_URL';
export const ENTSOE_SECURITY_TOKEN = 'ENTSOE_SECURITY_TOKEN';

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
        this.initHttpInterceptor();
    }

    getSolarForecast(periodStart: string, periodEnd: string): Observable<any> {
        const params = {
            securityToken: this.securityToken,
            psrType: ParseType.solar,
            processType: ProcessType.dayAhead,
            documentType: DocumentType.windAndSolarForecast,
            in_Domain: Location.germany,
            periodStart,
            periodEnd,
        };

        return this.httpClient.get<any>(this.baseUrl, { params }).pipe(
            map(res => parse.parse(res.data) as EntsoeDtoModel),
            catchError((e) => {
                return throwError(e);
            }));
    }

    getElectricity(periodStart: string, periodEnd: string): Observable<any> {
        const params = {
            securityToken: this.securityToken,
            processType: ProcessType.dayAhead,
            documentType: DocumentType.generationForecast,
            in_Domain: Location.germany,
            periodStart,
            periodEnd,
        };

        return this.httpClient.get<any>(this.baseUrl, { params }).pipe(
            map(res => parse.parse(res.data) as EntsoeDtoModel),
            catchError((e) => {
                return throwError(e);
            }));
    }

    private initHttpInterceptor() {
        this.httpClient.axiosRef.interceptors.request.use((request) => {
            this.logger.logHttpRequest(request, 'outgoing');
            if (request.method === 'get') {
                delete request.headers['content-length'];
            }
            return request;
        });

        this.httpClient.axiosRef.interceptors.response.use((response) => {
            this.logger.logHttpResponse(response);
            return response;
        });
    }
}
