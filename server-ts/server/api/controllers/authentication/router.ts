import express from 'express';
import controller from './controller';
import validator from './controller.validator';

export default express
  .Router()
  .post('/create', validator.create, controller.create)
  .post('/login', validator.login, controller.login);
