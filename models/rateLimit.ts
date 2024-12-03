export interface RateLimit {
  apiKeyId: string; // Associated API key ID
  endpoint: string; // API endpoint being accessed
  count: number; // Number of requests made
  resetAt: Date; // When the count resets
}
