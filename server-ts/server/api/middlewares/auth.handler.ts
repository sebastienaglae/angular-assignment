import { NextFunction, Request, Response } from 'express';
import AuthenticationService from '../services/authentication.service';

const TokenKind = 'Bearer';

export default function authHandler(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  req.token = null;
  req.isAuthenticated = false;

  const token = req.headers.authorization;
  if (token && token.startsWith(TokenKind)) {
    const tokenValue = token.slice(TokenKind.length).trim();
    try {
      const parsedToken = AuthenticationService.parseToken(tokenValue);
      if (parsedToken) {
        req.token = parsedToken;
        req.isAuthenticated = true;
      } else {
        next({ status: 401, errors: [{ message: 'Invalid token' }] });
        return;
      }
    } catch (err) {
      next({ status: 401, errors: [{ message: 'Invalid token' }] });
      return;
    }
  }
  next();
}
