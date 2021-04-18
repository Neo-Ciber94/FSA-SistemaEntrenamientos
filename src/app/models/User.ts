export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  salt: string;
  hash: string;
  creationDate: Date;
}
