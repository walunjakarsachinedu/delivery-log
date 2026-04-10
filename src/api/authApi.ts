import { authRepository } from "./authRepository";

export const authApi: AuthApi = authRepository;

export interface AuthApi {
  login: (payload: {
    email: string;
    password: string;
  }) => Promise<string>;

  register: (payload: {
    email: string;
    password: string;
  }) => Promise<string>;

  logout: () => Promise<boolean>;
}