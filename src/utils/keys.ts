import fs from 'fs';
import path from 'path';
import jose from 'node-jose';

export const KEYS_PATH = path.resolve(process.cwd(), './keys/keys.json');

const fetchKeySet = (): Buffer => {
  const ks = fs.readFileSync(KEYS_PATH);
  return ks;
};

export const getKeyStore = async (): Promise<jose.JWK.KeyStore> => {
  const keySet = fetchKeySet();
  const store = await jose.JWK.asKeyStore(keySet.toString());
  return store;
};

export const generate = async (numberOfKeys = 1): Promise<void> => {
  const keyStore = jose.JWK.createKeyStore();
  const queue: Promise<jose.JWK.Key>[] = [];
  let count = numberOfKeys || 1;
  while (count) {
    queue.push(keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' }));
    count -= 1;
  }
  await Promise.all(queue);
  const keys = keyStore.toJSON(true);
  await fs.writeFileSync(KEYS_PATH, JSON.stringify(keys));
};

export const generateUsingPEM = async (privateKeyPath = './keys/private.pem'): Promise<number> => {
  const keyStore = jose.JWK.createKeyStore();

  // load file
  const key = fs.readFileSync(path.resolve(process.cwd(), privateKeyPath));

  // load key
  await keyStore.add(key, 'pem');

  const keys = keyStore.toJSON(true);
  await fs.writeFileSync(KEYS_PATH, JSON.stringify(keys));

  // return no. of keys generated
  const numberOfKeys = keyStore.all({ use: 'sig' }).length;
  return numberOfKeys;
};
