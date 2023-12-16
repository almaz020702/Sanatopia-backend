import { TokenPair } from './token-pair.interface';

export interface AuthResponse {
  message: string;
  user: {
    email: string;
    id: number;
  };
  tokens: TokenPair;
}
