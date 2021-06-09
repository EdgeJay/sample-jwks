import { RequestHandler } from 'express';
import { ExtendedRequestHandler, GenerateReqBody } from '../middlewares/params';
import { getKeyStore, generate as keyGenerator, generateUsingPEM } from '../utils/keys';

export const jwks: RequestHandler = async (req, res) => {
  const keyStore = await getKeyStore();
  res.json(keyStore.toJSON());
};

export const generate: ExtendedRequestHandler<GenerateReqBody> = async (req, res) => {
  const { count, usePEM } = req.body;
  if (!usePEM) {
    await keyGenerator(count);
    res.json({ numberOfKeys: count });
  } else {
    const numberOfKeys = await generateUsingPEM();
    res.json({ numberOfKeys });
  }
};
