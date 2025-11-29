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
  storageType?: 'local' | 'supabase' | 'asset'; // Track storage method
  isAssetFile?: boolean; // Flag for pre-loaded asset files
  compressed?: boolean; // Flag for compressed files
  originalFileSize?: number; // Original file size before compression
}  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
  }