export interface User {
  id: string; // MongoDB ObjectId or UUID
  username: string;
  email: string;
  passwordHash: string; // Hashed password
  createdAt: Date;
  updatedAt: Date;
}
