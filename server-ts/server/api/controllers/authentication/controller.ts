import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserService from '../../services/user.service';
import AuthenticationService from '../../services/authentication.service';

export class Controller {
  async create(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const user = await UserService.create(
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.type
      );

      res.status(201).json({ id: user._id });
    } catch (err) {
      res.status(400).json({ errors: [{ message: err.message }] });
      return;
    }
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 400, errors: errors.array() });
      return;
    }

    const user = await UserService.findByCredentials(
      req.body.usernameOrEmail,
      req.body.password
    );
    if (user === null) {
      next({ status: 401, errors: [{ message: 'Invalid credentials' }] });
      return;
    }

    const token = AuthenticationService.createToken(user);
    res.json({ token });
  }
}

export default new Controller();
