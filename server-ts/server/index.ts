import './common/env';
import Server from './common/server';
import routes from './routes';
import * as mongoose from 'mongoose';
import * as console from 'console';

const port = parseInt(process.env.PORT ?? '3000');
const mongoUrl = process.env.MONGO_URL ?? 'mongodb://localhost:27017';

mongoose.connect(mongoUrl).then(() => {
  console.log('Connected to MongoDB');
});

export default new Server().router(routes).listen(port);
