# Express nostr auth

[![npm version](https://badge.fury.io/js/express-nostr-auth.svg)](https://badge.fury.io/js/express-nostr-auth)

Express middleware for nostr http authorization using [nip98](https://github.com/nostr-protocol/nips/blob/master/98.md)

## Installation

```sh
npm install -s express-nostr-auth
```

## Usage

Protect express routes with nostr http authorization, see [nip98](https://github.com/nostr-protocol/nips/blob/master/98.md)

```ts
import { nostrAuthorization } from "express-nostr-auth";

export const app = express();

app.use(
  "/api",
  nostrAuthorization({
    ttl: 60,
    debug: false,
    persistPubkeyFieldName: "nostr",
    persistPubkey: true,
  })
);
```

Incoming requests must include the nostr http authorization header to access the resource

```
Authorization: Nostr eyJraW5kIjoyNzIzNSwidGFnc==....
```

Example: Generate the authorization token with your nostr bech32 secret key

```ts
import { finalizeEvent, nip98, nip19 } from 'nostr-tools';

const apiRequest = async () => {
    // The nostr bech32 secret key
    const sk = process.env.NOSTR_PKEY as nip19.NSec;

    // decode to uint8 array
    const skBytes = nip19.decode(sk);

    // the proctected api route
    const apiUrl = 'http://localhost:3000/api/state';
    const method = 'GET';

    // generates nostr base64 token: Nostr eyJraW5kIjoyNzIzNSwidGFnc==....
    const token = await nip98.getToken(
        apiUrl,
        method,
        (e) => finalizeEvent(e, skBytes.data),
        true
    );

    // use the token in API requests to authorize with the nostr event
    return fetch(apiUrl, {
        method,
        headers: {
            Authorization: token
        }
    });
};
```

# Test

Run test suite

```sh
npm test
```
