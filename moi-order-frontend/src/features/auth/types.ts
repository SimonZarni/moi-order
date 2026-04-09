export interface LoginFormState {
  email: string;
  password: string;
  errors: Record<string, string>;
}

export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  errors: Record<string, string>;
}
