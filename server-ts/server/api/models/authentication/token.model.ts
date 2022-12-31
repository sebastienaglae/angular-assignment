import { Schema } from 'mongoose';
import UserType from '../user/user.type';

export default interface IToken {
  userId: Schema.Types.ObjectId;
  userType: UserType;
}
