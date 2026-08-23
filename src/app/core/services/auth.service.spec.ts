import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Auth,
          useValue: {
            currentUser: null,
            authStateReady: () => Promise.resolve(),
            onAuthStateChanged: (callback: (user: null) => void) => {
              callback(null);
              return () => undefined;
            },
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
