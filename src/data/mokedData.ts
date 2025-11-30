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
    password: 'user@2025.',
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
    fileSize: 0,
    filePath: '/Certificate  Final - Joseph Nkiria Emmanuel.pdf',
    fileUrl: '/Certificate  Final - Joseph Nkiria Emmanuel.pdf',
    storageType: 'asset',
    isAssetFile: true,
    createdAt: '2014-12-21'
  }
];

const loadDocuments = (): Document[] => {
  try {
    const stored = localStorage.getItem('documents');
    if (stored) {
      const docs = JSON.parse(stored);
      const hasCertificate = docs.some((doc: Document) => doc.id === 'cert_joseph_2007');
      if (!hasCertificate && docs.length === 0) {
        saveDocuments(defaultDocuments);
        return defaultDocuments;
      }
      return docs;
    } else {
      saveDocuments(defaultDocuments);
      return defaultDocuments;
    }
  } catch (error) {
    console.error('Error loading documents:', error);
    return defaultDocuments;
  }
};

const saveDocuments = (docs: Document[]) => {
  try {
    localStorage.setItem('documents', JSON.stringify(docs));
  } catch (error) {
    console.error('Failed to save documents:', error);
  }
};

export const getDocuments = (): Document[] => {
  return loadDocuments();
};

export const addUser = (user: Omit<User, 'id'>) => {
  const newUser: User = {
    ...user,
    id: Date.now().toString()
  };
  users.push(newUser);
  return newUser;
};

const MAX_LOCALSTORAGE_SIZE = 5 * 1024 * 1024;
const LARGE_FILE_THRESHOLD = 1024 * 1024;

const compressText = (text: string): string => {
  return btoa(text.replace(/\s+/g, ' ').trim());
};

export const fileToBase64 = (file: File): Promise<{ data: string; compressed: boolean; originalSize: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      const originalSize = file.size;
      
      if (result.length > MAX_LOCALSTORAGE_SIZE) {
        reject(new Error(`File too large for local storage. Maximum size: ${(MAX_LOCALSTORAGE_SIZE / 1024 / 1024).toFixed(1)}MB`));
        return;
      }
      
      let finalData = result;
      let compressed = false;
      
      if (originalSize > LARGE_FILE_THRESHOLD && file.type.startsWith('text/')) {
        try {
          const textContent = result.split(',')[1];
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

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const addDocument = (document: Omit<Document, 'id'>) => {
  const currentDocs = loadDocuments();
  
  const newDocument: Document = {
    ...document,
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: document.createdAt || new Date().toISOString().split('T')[0]
  };
  
  const updatedDocs = [...currentDocs, newDocument];
  saveDocuments(updatedDocs);
  window.dispatchEvent(new CustomEvent('documentsChanged'));
  
  return newDocument;
};

export const removeDocument = (id: string) => {
  const currentDocs = loadDocuments();
  const index = currentDocs.findIndex(doc => doc.id === id);
  
  if (index > -1) {
    const updatedDocs = currentDocs.filter(doc => doc.id !== id);
    saveDocuments(updatedDocs);
    window.dispatchEvent(new CustomEvent('documentsChanged'));
    return true;
  }
  
  return false;
};

export const resetToDefaultDocuments = () => {
  localStorage.removeItem('documents');
  const docs = [...defaultDocuments];
  saveDocuments(docs);
  window.dispatchEvent(new CustomEvent('documentsChanged'));
  return docs;
};

export const ensureCertificateExists = () => {
  const currentDocs = loadDocuments();
  const hasCertificate = currentDocs.some(doc => doc.id === 'cert_joseph_2007');
  
  if (!hasCertificate) {
    const updatedDocs = [...currentDocs, ...defaultDocuments];
    saveDocuments(updatedDocs);
    window.dispatchEvent(new CustomEvent('documentsChanged'));
    return updatedDocs;
  }
  
  return currentDocs;
};
