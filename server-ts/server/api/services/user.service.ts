import { IUser, User } from '../models/db/user.model';
import * as crypto from 'crypto';
import UserType from '../models/user/user.type';

class UserService {
  private readonly _hmacKey: string;
  constructor() {
    this._hmacKey = process.env.HMAC_KEY || 'default-key';
  }
  public async create(
    username: string,
    email: string,
    password: string,
    type: UserType
  ): Promise<IUser> {
    try {
      const newUser = await User.create({
        username,
        email,
        passwordHash: this.hashPassword(password),
        type,
      });
      return newUser;
    } catch (err) {
      if (err.code === 11000) {
        throw new CreateError('Username or email already exists');
      }
      throw err;
    }
  }
  public async findByCredentials(
    usernameOrEmail: string,
    password: string
  ): Promise<IUser | null> {
    const user = await User.findOne({
      $and: [
        { $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
        { passwordHash: this.hashPassword(password) },
      ],
    });
    return user;
  }
  private hashPassword(password: string): string {
    const hmac = crypto.createHmac('sha512', this._hmacKey);
    return hmac.update(password).digest('hex');
  }
}

class CreateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreateError';
  }
}

export default new UserService();
