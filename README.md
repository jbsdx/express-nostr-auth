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
import { finalizeEvent } from "nostr-tools";
import { decode, NSec } from "nostr-tools/nip19";
import { getToken } from "nostr-tools/nip98";
import { axios } from "axios";

// The nostr bech32 secret key
const sk = process.env.NOSTR_PKEY as NSec;

// decode to uint8 array
const skBytes = decode(sk);

// the proctected api route
const apiUrl = "http://localhost:3000/api/state";

// generates nostr base64 token: Nostr eyJraW5kIjoyNzIzNSwidGFnc==....
const token = await getToken(
  apiUrl,
  "GET",
  (e) => finalizeEvent(e, skBytes.data),
  true
);

// use the token in API requests to authorize with the nostr event
axios.get(apiUrl, {
  headers: {
    authorization: token,
  },
});
```

# Test

Run test suite

```sh
npm test
```
