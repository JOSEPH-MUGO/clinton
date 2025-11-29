export interface User {
    id: string;
    username: string;
    password: string;
    role: 'user' | 'admin';
  }
  
  export interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
  }