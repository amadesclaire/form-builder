export interface User {
  _id?: string; // MongoDB's internal ID
  id?: string; // Application-friendly ID
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
