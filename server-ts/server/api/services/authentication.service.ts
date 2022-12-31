import { IUser } from '../models/db/user.model';
import IToken from '../models/authentication/token.model';
import jwt from 'jsonwebtoken';

class AuthenticationService {
  private readonly _jwtKey: string;
  constructor() {
    this._jwtKey = process.env.JWT_KEY || 'default-key';
  }
  public createToken(user: IUser): string {
    const token: IToken = {
      userId: user._id,
      userType: user.type,
    };
    return jwt.sign(token, this._jwtKey, { expiresIn: '1d' });
  }
  public parseToken(token: string): IToken | null {
    const decoded = jwt.verify(token, this._jwtKey) as IToken;
    return decoded;
  }
}

export default new AuthenticationService();
