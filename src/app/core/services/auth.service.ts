import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { from, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environement';

interface FirebasePasswordSignInResponse {
  readonly idToken: string;
  readonly email: string;
  readonly refreshToken: string;
  readonly localId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userSignal = signal<User | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    authState(this.auth).subscribe((firebaseUser) => {
      this.userSignal.set(firebaseUser);
    });
  }

  login(email: string, password: string): Observable<User> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`;

    return this.http
      .post<FirebasePasswordSignInResponse>(url, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        switchMap(() => from(signInWithEmailAndPassword(this.auth, email, password))),
        map((credential) => credential.user),
      );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.auth.authStateReady()).pipe(map(() => this.auth.currentUser !== null));
  }
}
