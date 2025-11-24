export interface User {
  id: string | number;
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