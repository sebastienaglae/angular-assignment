import { body } from 'express-validator';
import UserType from '../../models/user/user.type';
import auth from '../../validators/auth';

export class Validator {
  public readonly login = [
    body('usernameOrEmail').isLength({ min: 3, max: 255 }),
    body('password').isLength({ min: 8 }),
    auth.isNotAuthenticated,
  ];
  public readonly create = [
    body('email').isEmail(),
    body('username').isLength({ min: 4, max: 16 }),
    body('password').isLength({ min: 8 }),
    body('type').isIn(
      Object.values(UserType).filter((v) => typeof v === 'number')
    ),
    auth.isNotAuthenticated,
  ];
}

export default new Validator();
