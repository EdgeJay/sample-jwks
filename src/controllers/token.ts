import jose from 'node-jose';
import jwksClient, { RsaSigningKey } from 'jwks-rsa';
import jwt, { Secret, GetPublicKeyOrSecret, VerifyOptions } from 'jsonwebtoken';
import { ExtendedRequestHandler } from '../middlewares/params';
import { getKeyStore } from '../utils/keys';
import { getJwksUri, getTokenIssuer } from '../utils/env';

const asyncTokenVerify = (
  token: string,
  secretOrPublicKey: Secret | GetPublicKeyOrSecret,
  options?: VerifyOptions
): Promise<Partial<Record<string, unknown>> | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, options, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

// Use jsonwebtoken to verify and decode token,
// to emulate verifying tokens at client side,
// and validate token is signed by trusted party using JWKS
const getKey: GetPublicKeyOrSecret = (header, callback) => {
  const jwksUri = getJwksUri();

  if (!jwksUri) {
    callback(new Error('Invalid JWKS URI'));
    return;
  }

  jwksClient({
    jwksUri,
    timeout: 5000,
  }).getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey() || (key as RsaSigningKey).rsaPublicKey;
      callback(null, signingKey);
    }
  });
};

export const create: ExtendedRequestHandler = async (req, res, next) => {
  const iss = getTokenIssuer();

  if (!iss) {
    next(new Error('Invalid token issuer'));
    return;
  }

  // fetch payload
  const { secondsToExpiry, sub, ...payload } = req.body;

  // create token
  const keyStore = await getKeyStore();
  const [rawKey] = keyStore.all({ use: 'sig' });
  const key = await jose.JWK.asKey(rawKey);
  const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } };
  const token = await jose.JWS.createSign(opt, key)
    .update(
      JSON.stringify({
        iss,
        exp: Math.floor(Date.now() / 1000) + secondsToExpiry,
        iat: Math.floor(Date.now() / 1000),
        sub,
        ...payload,
      })
    )
    .final();
  res.json({ token });
};

export const verify: ExtendedRequestHandler = async (req, res, next) => {
  // fetch header
  const { authorization: token } = req.headers;

  if (!token) {
    next(new Error('Invalid token'));
    return;
  }

  try {
    const decoded = await asyncTokenVerify(token, getKey);
    res.json({ decoded });
  } catch (err) {
    res.json({ error: err });
  }
};
