import IToken from '../models/authentication/token.model';

declare global {
  namespace Express {
    interface Request {
      token: IToken | null;
      isAuthenticated: boolean;
    }
  }
}
