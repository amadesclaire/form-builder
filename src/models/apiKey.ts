export interface APIKey {
  id: string; // UUID or MongoDB ObjectId
  userId: string; // Associated user ID
  keyHash: string; // Hashed API key
  createdAt: Date;
  revoked: boolean; // Indicates if the key has been revoked
}
