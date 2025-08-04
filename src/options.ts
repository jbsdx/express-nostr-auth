/**
 * Authorization options for the express middleware function
 */
export interface NostrAuthOptions {
    /**
     * Nostr event creation maximum age (time to live) in seconds
     * 
     * @default 60
     */
    ttl: number;
    /**
     * Adds nostr user pubkey to express request object
     * 
     * @default false
     */
    persistPubkey: boolean;
    /**
     * The field name in the express request object
     * 
     * @default nostr
     */
    persistPubkeyFieldName: string;
    /**
     * Adds console.log output during authorization process
     * 
     * @default false
     */
    debug: boolean;
}

/**
 * Nostr request options
 */
export interface NostrRequestOptions {
    /**
     * The nostr base64 auth token
     */
    token: string;
    /**
     * The protected request URL
     */
    requestUrl: string;
    /**
     * The request payload
     */
    body?: unknown;
    /**
     * The request method, e.g. "POST", "GET", ..
     */
    method: string;
}
