import { RequestHandler } from 'express';

export const root: RequestHandler = (req, res) => {
  res.send('Hello!');
};
