export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface FirebaseAuthError {
  readonly code: string;
  readonly message: string;
}

export function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}
