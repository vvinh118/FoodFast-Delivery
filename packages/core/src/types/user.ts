export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: 'admin' | 'merchant' | 'customer';
  password?: string;
  token?: string;
  tel?: string;
  address?: string;
  birthday?: string; 
  avatar?: string;
}