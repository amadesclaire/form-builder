export interface User {
  _id?: string; // MongoDB's internal ID
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
