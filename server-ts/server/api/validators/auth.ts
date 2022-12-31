import { NextFunction, Request, Response } from 'express';
import UserType from '../models/user/user.type';

const validators = {
  isAuthenticated: (req: Request, _: Response, next: NextFunction) => {
    if (req.isAuthenticated) {
      next();
      return;
    }
    next({ status: 401, errors: [{ message: 'Not authenticated' }] });
  },
  isNotAuthenticated: (req: Request, _: Response, next: NextFunction) => {
    if (req.isAuthenticated) {
      next({ status: 400, errors: [{ message: 'Already logged in' }] });
      return;
    }
    next();
  },
  ofUserType: (type: UserType) => {
    return (req: Request, _: Response, next: NextFunction) => {
      if (req.token?.userType === type) {
        next();
        return;
      }
      next({ status: 403, errors: [{ message: 'Forbidden' }] });
    };
  },
};

export default validators;
