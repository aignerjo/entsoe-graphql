import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, Subject } from 'rxjs';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

@Injectable()
export class HttpServiceMock {
    pendingRequests: Array<{ url: string, subject: Subject<AxiosResponse<any>> }> = [];
    expectations: Array<Request & AxiosRequestConfig> = [];

    get<T = any>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        const subject = new Subject<AxiosResponse<T>>();
        this.pendingRequests.push({ url, subject });
        this.expectations.push(Object.assign({}, {
            url,
            method: HttpMethod.GET,
        } as Request, config));
        return subject;
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        const subject = new Subject<AxiosResponse<T>>();
        this.pendingRequests.push({ url, subject });
        this.expectations.push(Object.assign({}, {
            url,
            method: HttpMethod.DELETE,
        } as Request, config));
        return subject;
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        const subject = new Subject<AxiosResponse<T>>();
        this.pendingRequests.push({ url, subject });
        this.expectations.push(Object.assign({}, {
            url,
            method: HttpMethod.POST,
            body: data,
        } as Request, config));
        return subject;
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        const subject = new Subject<AxiosResponse<T>>();
        this.pendingRequests.push({ url, subject });
        this.expectations.push(Object.assign({}, {
            url,
            method: HttpMethod.PUT,
            body: data,
        } as Request, config));
        return subject;
    }

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        const subject = new Subject<AxiosResponse<T>>();
        this.pendingRequests.push({ url, subject });
        this.expectations.push(Object.assign({}, {
            url,
            method: HttpMethod.PATCH,
            body: data,
        } as Request, config));
        return subject;
    }

    flush<T = any>(status: number, data?: T, headers?: any, statusText?: string) {
        const pendingRequest = this.pendingRequests.pop();
        if (status < HttpStatus.BAD_REQUEST) {
            pendingRequest.subject.next({
                data,
                status,
                statusText,
                headers,
                config: null,
                request: null,
            });
        } else {
            pendingRequest.subject.error({
                data,
                status,
                statusText,
                headers,
                config: null,
                request: null,
            });
        }
        pendingRequest.subject.complete();
    }

    expectOne(method: HttpMethod | string, url: string, data?: any) {
        expect(this.expectations.length).toEqual(1);
        const request = this.expectations.pop();

        expect(request.method).toEqual(method);
        expect(request.url).toEqual(url);

        if (data) {
            expect(request.body).toEqual(data);
        }
    }

    popRequest(cb: (req: Request & AxiosRequestConfig) => any) {
        cb(this.expectations.pop());
    }

    verify() {
        if (this.pendingRequests.length > 0) {
            let error = '';
            for (const request of this.pendingRequests) {
                error += 'There is request pending for: ' + request.url + '\n';
            }

            fail(error + '\nExpected no pending requests but found ' + this.pendingRequests.length);
        }
    }
}
