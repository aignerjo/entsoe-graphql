import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as parse from 'fast-xml-parser';
import * as pino from 'pino';

@Injectable()
export class LoggingService {

    private readonly logger: pino.Logger;

    constructor() {
        this.logger = pino({
            name: 'entsoe-adapter',
            level: process.env.LOG_LEVEL || 'debug',
        });
    }

    logHttpRequest(request: AxiosRequestConfig, direction: string) {
        this.logger.info({
            message: `${direction} request: ${request.method} ${request.url}`,
            headers: LoggingService.sanitizeHeader(request.headers),
            body: request.data,
            method: request.method,
            params: request.params,
            url: request.url,
        });
    }

    logHttpResponse(response: AxiosResponse) {
        const request = response.config;
        this.logger.debug({
            message: `response from outgoing request to ${request ? request.url : undefined} with status: ${response.status}`,
            headers: LoggingService.sanitizeHeader(response.headers || undefined),
            body: response.data ? parse.parse(response.data) : undefined,
            status: response.status,
            url: request ? request.url : undefined,
        });
    }

    private static sanitizeHeader(headers: any): Headers {
        if (!headers) {
            return undefined;
        }
        const sanitized = {} as any;
        for (const [key, value] of Object.entries(headers)) {
            if (!(typeof value === 'string') || (key.toLowerCase() === 'securitytoken')) {
                continue;
            }
            sanitized[key] = value as string;
        }
        return sanitized;
    }

}
