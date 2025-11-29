import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/mockedData';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid username or password');
    }
>>>>>>> 8af3ea37ef47faedd52e47079ff0496b771d014e
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        margin: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            🔐
          </div>
          <h1 style={{ 
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#2d3748',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            margin: 0,
            color: '#718096',
            fontSize: '16px'
          }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600',
              color: '#4a5568',
              fontSize: '14px'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 48px', 
                  boxSizing: 'border-box',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              />
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a0aec0'
              }}>
                👤
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontWeight: '600',
                color: '#4a5568',
                fontSize: '14px'
              }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 48px', 
                  boxSizing: 'border-box',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              />
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a0aec0'
              }}>
                🔒
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              padding: '16px',
              marginBottom: '20px',
              backgroundColor: '#fed7d7',
              border: '1px solid #feb2b2',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ 
                color: '#c53030',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span>
                {error}
              </div>
            </div>
          )}

          {/* Login Button */}
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div style={{ 
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #bae6fd'
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0',
            fontSize: '14px',
            color: '#0369a1',
            fontWeight: '600'
          }}>
            Demo Credentials
          </h4>
          <div style={{ fontSize: '13px', color: '#0c4a6e', lineHeight: '1.5' }}>
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>User:</strong> user1 / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
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
=======
export default Login;
>>>>>>> 8af3ea37ef47faedd52e47079ff0496b771d014e
