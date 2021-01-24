import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { API_MAP } from '../config/api-map';

import { Observable } from 'rxjs';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url in API_MAP) {
      const processor = API_MAP[req.url];
      if (processor instanceof Function) return processor(req.body, req.params);
      const cloneReq = req.clone({
        url: processor
      });
      return next.handle(cloneReq);
    }
    return next.handle(req);
  }
}
