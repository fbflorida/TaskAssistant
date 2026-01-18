import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { inject } from '@angular/core';

export function TokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
    
    const tokenService = inject(TokenService);

    if(req.url.includes('login'))
        return next(req);
    
    const token = tokenService.getToken();
    const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq);
}