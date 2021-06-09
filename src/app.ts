import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { getNodePort } from './utils/env';

dotenv.config();

const port = getNodePort();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
