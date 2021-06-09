export const getNodePort = (): number =>
  process.env?.NODE_PORT ? parseInt(process.env?.NODE_PORT, 10) : 3000;

export const getJwksUri = (): string | undefined => process.env?.JWKS_URI;

export const getTokenIssuer = (): string | undefined => process.env?.TOKEN_ISSUER;
