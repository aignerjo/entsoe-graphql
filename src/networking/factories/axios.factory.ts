import { HttpModuleOptions, HttpModuleOptionsFactory, Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';

@Injectable({ scope: Scope.REQUEST })
export class AxiosFactory implements HttpModuleOptionsFactory {
  constructor(@Inject(CONTEXT) private context) {
  }

  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions {
    const headers = { ...this.context.headers };
    delete headers['content-length'];
    return Promise.resolve({ headers });
  }
}
