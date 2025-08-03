# Express nostr auth

Express middleware for nostr http authorization using [nip98](https://github.com/nostr-protocol/nips/blob/master/98.md)

## Installation

```sh
npm install -s express-nostr-auth
```

## Usage

```ts
import { nostrAuthorization } from "express-nostr-auth";

export const app = express();

app.use(
  "/api",
  nostrAuthorization({
    ttl: 60,
    debug: false,
    persistPubkey: true,
  })
);
```

# Test

Run test suite

```sh
npm test
```
