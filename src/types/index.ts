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
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  filePath?: string; // Supabase storage path
  fileUrl?: string;  // Public URL for file access
  fileData?: string; // Base64 encoded file data for local storage
  storageType?: 'local' | 'supabase'; // Track storage method
}  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
  }