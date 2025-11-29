import { User, Document } from '../types';

export let users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    username: 'user1',
    password: 'user123',
    role: 'user'
  }
];

// Pre-loaded documents
const defaultDocuments: Document[] = [
  {
    id: 'cert_joseph_2007',
    title: 'Certificate Final - Joseph Nkiria Emmanuel',
    content: 'Professional certification document for Joseph Nkiria Emmanuel',
    fileName: 'Certificate  Final - Joseph Nkiria Emmanuel.pdf',
    fileType: 'application/pdf',
    fileSize: 0, // Size will be determined when accessed
    filePath: '/Certificate  Final - Joseph Nkiria Emmanuel.pdf',
    fileUrl: '/Certificate  Final - Joseph Nkiria Emmanuel.pdf',
    storageType: 'asset',
    isAssetFile: true,
    createdAt: '2007-07-24'
  }
];

// Load documents from localStorage if available
const loadDocuments = (): Document[] => {
  try {
    const stored = localStorage.getItem('documents');
    if (stored) {
      const docs = JSON.parse(stored);
      console.log('Loading documents from localStorage:', docs.length);
      
      // Check if the certificate is already in the list
      const hasCertificate = docs.some((doc: Document) => doc.id === 'cert_joseph_2007');
      if (!hasCertificate && docs.length === 0) {
        // If no documents and no certificate, load defaults
        console.log('No documents found, initializing with default certificate');
        saveDocuments(defaultDocuments);
        return defaultDocuments;
      }
      return docs;
    } else {
      // Initialize with default documents if no stored data
      console.log('Initializing with default documents including certificate');
      saveDocuments(defaultDocuments);
      return defaultDocuments;
    }
  } catch (error) {
    console.error('Error loading documents:', error);
    return defaultDocuments;
  }
};

// Save documents to localStorage
const saveDocuments = (docs: Document[]) => {
  try {
    localStorage.setItem('documents', JSON.stringify(docs));
    console.log('Documents saved to localStorage:', docs.length);
  } catch (error) {
    console.error('Failed to save documents:', error);
  }
};

// Get fresh documents from localStorage
export const getDocuments = (): Document[] => {
  return loadDocuments();
};

// Initialize with empty array - will be loaded dynamically
export let documents: Document[] = [];

// Helper functions to manage data
export const addUser = (user: Omit<User, 'id'>) => {
  const newUser: User = {
    ...user,
    id: Date.now().toString()
  };
  users.push(newUser);
  return newUser;
};

export const addDocument = (document: Omit<Document, 'id'>) => {
  console.log('Adding document:', document.title);
  
  // Get current documents from localStorage
  const currentDocs = loadDocuments();
  
  const newDocument: Document = {
    ...document,
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: document.createdAt || new Date().toISOString().split('T')[0]
  };
  
  // Add to the list
  const updatedDocs = [...currentDocs, newDocument];
  
  // Save back to localStorage
  saveDocuments(updatedDocs);
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('documentsChanged'));
  
  console.log('Document added successfully. New total:', updatedDocs.length);
  return newDocument;
};

export const removeDocument = (id: string) => {
  console.log('Removing document:', id);
  
  // Get current documents from localStorage
  const currentDocs = loadDocuments();
  
  const index = currentDocs.findIndex(doc => doc.id === id);
  if (index > -1) {
    const updatedDocs = currentDocs.filter(doc => doc.id !== id);
    saveDocuments(updatedDocs);
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('documentsChanged'));
    
    console.log('Document removed successfully. New total:', updatedDocs.length);
    return true;
  }
  console.log('Document not found for removal:', id);
  return false;
};

// File size constants (in bytes)
const MAX_LOCALSTORAGE_SIZE = 5 * 1024 * 1024; // 5MB for localStorage
const LARGE_FILE_THRESHOLD = 1024 * 1024; // 1MB threshold for compression

// Compress large text/JSON content using simple compression
const compressText = (text: string): string => {
  // Simple compression by removing redundant whitespace and encoding
  return btoa(text.replace(/\s+/g, ' ').trim());
};

// Decompress text content
const decompressText = (compressed: string): string => {
  try {
    return atob(compressed);
  } catch {
    return compressed; // Return as-is if not compressed
  }
};

// Convert file to base64 with size checking and compression
export const fileToBase64 = (file: File): Promise<{ data: string; compressed: boolean; originalSize: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      const originalSize = file.size;
      
      // Check if file is too large for localStorage
      if (result.length > MAX_LOCALSTORAGE_SIZE) {
        reject(new Error(`File too large for local storage. Maximum size: ${(MAX_LOCALSTORAGE_SIZE / 1024 / 1024).toFixed(1)}MB`));
        return;
      }
      
      // Apply compression for large files if it's text-based
      let finalData = result;
      let compressed = false;
      
      if (originalSize > LARGE_FILE_THRESHOLD && file.type.startsWith('text/')) {
        try {
          const textContent = result.split(',')[1]; // Remove data:type;base64, prefix
          const compressedContent = compressText(atob(textContent));
          finalData = result.split(',')[0] + ',' + compressedContent;
          compressed = true;
        } catch (error) {
          console.warn('Compression failed, using original:', error);
        }
      }
      
      resolve({ data: finalData, compressed, originalSize });
    };
    
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

// Helper to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to reset documents to default (including the certificate)
export const resetToDefaultDocuments = () => {
  console.log('Resetting to default documents with certificate');
  localStorage.removeItem('documents');
  const docs = [...defaultDocuments];
  saveDocuments(docs);
  window.dispatchEvent(new CustomEvent('documentsChanged'));
  console.log('Default documents saved:', docs);
  return docs;
};

// Function to add certificate if it doesn't exist
export const ensureCertificateExists = () => {
  const currentDocs = loadDocuments();
  const hasCertificate = currentDocs.some(doc => doc.id === 'cert_joseph_2007');
  
  if (!hasCertificate) {
    console.log('Adding certificate to existing documents');
    const updatedDocs = [...currentDocs, ...defaultDocuments];
    saveDocuments(updatedDocs);
    window.dispatchEvent(new CustomEvent('documentsChanged'));
    return updatedDocs;
  }
  
  return currentDocs;
};