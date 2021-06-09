import express from 'express';
import { tokenParams, verifyParams, generateParams, validateParams } from './middlewares/params';
import * as pages from './controllers/pages';
import * as keys from './controllers/keys';
import * as tokenHandlers from './controllers/token';

const routes = express.Router();

routes.get('/', pages.root);

routes.get('/jwks', keys.jwks);

routes.post('/generate', ...generateParams, validateParams, keys.generate);

routes.post('/token', ...tokenParams, validateParams, tokenHandlers.create);

routes.get('/verify', ...verifyParams, validateParams, tokenHandlers.verify);

export default routes;
