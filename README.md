# Sample JWKS Project

Experimentation with JWKS

## Pre-requisites

- Node.js 12 and above
- Create private key in PEM format and save as `private.key` into `keys` folder (refer to "Generate private key") section

## Getting Started

1. npm install
2. npm run keys:generate (this script will (re)generate keys.json file inside `keys` folder)
3. npm run build
4. Import `sample-jwks.postman_collection.json` into Postman client to start testing

## Endpoints

### Retrieve JWKS

| Method | Endpoint |
|---|---|
| GET | /jwks |

### Create JWT token

| Method | Endpoint |
|---|---|
| POST | /token |

Create JWT token, this endpoint accepts JSON request body consisting of any params, but `sub` and `secondsToExpiry` must be defined:

| Name | Type | Optional | Default | Purpose |
|---|---|---|---|---|
| sub | string | No | | Use to populate `sub` claim of JWT token, which identifies the principal that is the subject of the JWT |
| secondsToExpiry | number | No | | Sets longevity of token in seconds |

### Verify JWT token

| Method | Endpoint |
|---|---|
| GET | /verify |

**Headers**

| Name | Optional | Default | Purpose |
|---|---|---|---|
| Authorization | No | | JWT token |

Use this endpoint to validate if JWT token is valid.

### Generate keys

| Method | Endpoint |
|---|---|
| POST | /generate |

Generate key set for JWKS endpoint, this endpoint accepts JSON request body consisting of following params:

| Name | Type | Optional | Default | Purpose |
|---|---|---|---|---|
| count | number | Yes | 1 | Set no. of keys to generate in key set, ignored if usePEM is `true` |
| usePEM | boolean | Yes | false | If set to true, `keys/private.pem` file will be used instead to generate key set |

## Generate private key

### macOS
`openssl genrsa -out ./keys/private.pem 2048`
