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
     * @default user
     */
    persistPubkeyFieldName: string;
    /**
     * Adds console.log output during authorization process
     * 
     * @default false
     */
    debug: boolean;
}