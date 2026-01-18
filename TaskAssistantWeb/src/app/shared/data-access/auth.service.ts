import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Subject, of, Observable, EMPTY, merge } from 'rxjs';
import { startWith, switchMap, map, catchError, tap, concatMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environment/environment';;
import { Router } from '@angular/router';
import { RegisterInfo, UserInfo, UserLogin } from '../interfaces/userinfo';
import { TokenService } from './token.service';

type Status =
  | 'initial'
  | 'authenticating'
  | 'authenticated'
  | 'fail'
  | 'unauthenticated';

interface AuthState {
  status: Status;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  public login$ = new Subject<UserLogin>();
  public logout$ = new Subject<void>();
  public register$ = new Subject<RegisterInfo>();

  headers = new HttpHeaders({
    'Content-Type': 'application/json',    
  });

  private loginStatus$: Observable<Status> = this.login$.pipe(
    switchMap((userLogin) =>
      this.http
        .post<any>(`${environment.API_URL}/identity/login`, JSON.stringify(userLogin), 
            { headers: this.headers })
        .pipe(
          tap((res) => { this.tokenService.setToken(res.accessToken) }),
          map(() => 'authenticated' as const),
          catchError(() => of('fail' as const)),
          startWith('authenticating' as const),
        )
    ),
  );

  private logoutStatus$: Observable<Status> = this.logout$.pipe(
    switchMap(() =>
      this.http.post(`${environment.API_URL}/api/applicationuser/logout`, {}
        ,{ headers: this.headers }
      ).pipe(
        map(() => 'unauthenticated' as const),
        catchError(() => EMPTY),
      ),
    ),
  );

  
  registered$ = this.register$.pipe(
    concatMap((userRegister) => 
                this.http
                    .post<HttpResponse<any>>(`${environment.API_URL}/api/applicationuser/register`, 
                        JSON.stringify(userRegister), 
                        { headers: this.headers})
                    .pipe(catchError((err) => { return EMPTY; })),
                ),
    ).subscribe();

    getUserInfo(){
        return this.http
            .get<RegisterInfo>(`${environment.API_URL}/api/ApplicationUser/profile`, 
                { headers: this.headers})
            .pipe(catchError((err) => { return EMPTY; }))
    }

  // state
  private state = signal<AuthState>({
    status: 'initial',
  });


  // selectors
  status = computed(() => this.state().status);

  isAuthenticated = computed(() => this.state().status === 'authenticated');

  
  constructor() {
    merge(this.loginStatus$, this.logoutStatus$)
      .pipe(takeUntilDestroyed())
      .subscribe((status) =>
        this.state.update((state) => ({ ...state, status })),
      );

    effect(() => {
      const status = this.status();

      if (status === 'initial' || status === 'unauthenticated') {
        this.router.navigate(['login']);
      }

      if (status === 'authenticated') {
        this.router.navigate(['home']);
      }
    });
  }
}