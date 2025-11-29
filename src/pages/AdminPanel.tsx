import React, { useState, useEffect } from 'react';
import { users, getDocuments, addUser, addDocument, removeDocument, fileToBase64, formatFileSize, resetToDefaultDocuments, ensureCertificateExists } from '../data/mokedData';
import { uploadFile, deleteFile, getFileUrl, checkBucketExists, getBucketCreationInstructions, testSupabaseConnection } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'documents'>('users');
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' as 'user' | 'admin' });
  const [newDocument, setNewDocument] = useState({ title: '', content: '', fileName: '', fileType: '', fileSize: 0, filePath: '', fileUrl: '', fileData: '', storageType: 'local' as 'local' | 'supabase', createdAt: new Date().toISOString().split('T')[0] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creatingBucket, setCreatingBucket] = useState(false);
  const [storageMethod, setStorageMethod] = useState<'local' | 'supabase'>('local');
  const [documents, setDocuments] = useState<any[]>([]);

  // Load documents from localStorage on component mount and listen for changes
  useEffect(() => {
    const loadDocuments = () => {
      const loadedDocs = getDocuments();
      setDocuments(loadedDocs);
      console.log('AdminPanel loaded documents:', loadedDocs.length, loadedDocs);
      
      // Also check localStorage directly
      const stored = localStorage.getItem('documents');
      console.log('Raw localStorage data:', stored);
    };
    
    loadDocuments();
    
    // Listen for document changes
    const handleDocumentsChanged = () => {
      console.log('AdminPanel: Documents changed event received');
      loadDocuments();
    };
    
    window.addEventListener('documentsChanged', handleDocumentsChanged);
    
    return () => {
      window.removeEventListener('documentsChanged', handleDocumentsChanged);
    };
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newUser);
    setNewUser({ username: '', password: '', role: 'user' });
    alert('User added successfully!');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File size validation
      const maxSize = 50 * 1024 * 1024; // 50MB limit
      if (file.size > maxSize) {
        alert(`File too large. Maximum size allowed: 50MB\nSelected file size: ${formatFileSize(file.size)}`);
        e.target.value = ''; // Clear the input
        return;
      }
      
      setSelectedFile(file);
      setNewDocument({
        ...newDocument,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        title: newDocument.title || file.name.split('.')[0] // Auto-fill title if empty
      });
      
      // Show warning for large files
      if (file.size > 5 * 1024 * 1024) {
        console.warn(`Large file selected: ${formatFileSize(file.size)}. Upload may take longer.`);
      }
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDocument.title) {
      alert('Please provide a document title.');
      return;
    }

    if (!selectedFile && !newDocument.content) {
      alert('Please either upload a file or enter document content.');
      return;
    }

    setUploading(true);

    try {
      let documentData = { ...newDocument, storageType: storageMethod };

      if (selectedFile) {
        if (storageMethod === 'supabase') {
          // Try Supabase upload first
          const uploadResult = await uploadFile(selectedFile);
          
          if (uploadResult.error) {
            console.warn('Supabase upload failed, falling back to local storage:', uploadResult.error);
            // Fallback to local storage
            try {
              const fileResult = await fileToBase64(selectedFile);
              documentData = {
                ...documentData,
                fileData: fileResult.data,
                storageType: 'local',
                  compressed: fileResult.compressed,
                  originalFileSize: fileResult.originalSize,
                  content: documentData.content || `File stored locally (fallback): ${selectedFile.name} (${formatFileSize(fileResult.originalSize)}${fileResult.compressed ? ', compressed' : ''})`
              };
            } catch (fallbackError) {
              throw new Error(`Both cloud and local storage failed. Local error: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
            }
          } else {
            // Supabase upload successful
            const fileUrl = getFileUrl(uploadResult.path);
            documentData = {
              ...documentData,
              filePath: uploadResult.path,
              fileUrl: fileUrl,
              storageType: 'supabase',
              content: documentData.content || `File uploaded to cloud: ${selectedFile.name}`
            };
          }
        } else {
          // Use local storage directly
          try {
            const fileResult = await fileToBase64(selectedFile);
            documentData = {
              ...documentData,
              fileData: fileResult.data,
              storageType: 'local',
              compressed: fileResult.compressed,
              originalFileSize: fileResult.originalSize,
              content: documentData.content || `File stored locally: ${selectedFile.name} (${formatFileSize(fileResult.originalSize)}${fileResult.compressed ? ', compressed' : ''})`
            };
          } catch (error) {
            throw new Error(`Failed to process file for local storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      addDocument({ ...documentData, createdAt: newDocument.createdAt });
      
      setNewDocument({ title: '', content: '', fileName: '', fileType: '', fileSize: 0, filePath: '', fileUrl: '', fileData: '', storageType: 'local', createdAt: new Date().toISOString().split('T')[0] });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      alert(`Document added successfully! (Stored: ${documentData.storageType})`);
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to add document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = async (id: string, doc: any) => {
    const confirmMessage = `Are you sure you want to delete "${doc.title}"?\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // If document has a file in Supabase storage, delete it first
        if (doc.storageType === 'supabase' && doc.filePath) {
          const deleteResult = await deleteFile(doc.filePath);
          if (deleteResult.error) {
            console.error('Error deleting file from storage:', deleteResult.error);
            // Continue with document removal even if file deletion fails
          }
        }
        
        removeDocument(id);
        
        alert(`Document \"${doc.title}\" deleted successfully!`);
      } catch (error) {
        console.error('Error removing document:', error);
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  const handleCheckBucket = async () => {
    setCreatingBucket(true);
    try {
      console.log('🔍 Starting comprehensive storage test...')
      
      // First check basic bucket listing
      const bucketCheck = await checkBucketExists();
      console.log('Bucket check result:', bucketCheck);
      
      if (bucketCheck.error) {
        alert(`❌ Connection Error: ${bucketCheck.error}\n\nAvailable buckets: ${bucketCheck.buckets?.join(', ') || 'None found'}`);
        return;
      }

      if (!bucketCheck.exists) {
        alert(`❌ Bucket "documents" not found!\n\nAvailable buckets: ${bucketCheck.buckets?.join(', ') || 'None'}\n\nPlease:\n1. Go to Supabase Dashboard\n2. Create bucket named "documents"\n3. Make it Public`);
        return;
      }

      // If bucket exists, run full test
      const result = await testSupabaseConnection();
      
      if (result.success) {
        const details = result.details;
        const message = `✅ Storage Setup Complete!
        
Bucket: "${details.bucketInfo.name}"
Public: ${details.isPublic ? 'Yes ✓' : 'No ❌'}
Created: ${new Date(details.bucketInfo.created_at).toLocaleDateString()}
Total Buckets: ${details.totalBuckets}

${details.isPublic ? 'Ready for file uploads! 🚀' : 'Warning: Bucket is not public - uploads may fail!'}`;
        
        alert(message);
        console.log('✅ Storage test passed:', details);
      } else {
        alert(`❌ Storage Test Failed: ${result.error}`);
        console.error('❌ Storage test failed:', result);
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      alert('Error testing storage. Check browser console for details.');
    } finally {
      setCreatingBucket(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Admin Panel</h1>
        <div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{
              marginRight: '15px',
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'users' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'documents' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manage Documents
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h3>Add New User</h3>
          <form onSubmit={handleAddUser} style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
                style={{ padding: '8px', marginRight: '10px', width: '200px' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                style={{ padding: '8px', marginRight: '10px', width: '200px' }}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })}
                style={{ padding: '8px', marginRight: '10px' }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" style={{ padding: '8px 15px' }}>
                Add User
              </button>
            </div>
          </form>

          <h3>Existing Users</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'documents' && (
        <div>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f0f8ff', 
            border: '1px solid #b3d9ff', 
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <strong>📁 Storage Options:</strong><br/>
            <div style={{ marginTop: '10px' }}>
              <label style={{ marginRight: '20px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="storage"
                  value="local"
                  checked={storageMethod === 'local'}
                  onChange={(e) => setStorageMethod('local')}
                  style={{ marginRight: '5px' }}
                />
                💾 Local Storage (Browser - Simple & Works Immediately)
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="storage"
                  value="supabase"
                  checked={storageMethod === 'supabase'}
                  onChange={(e) => setStorageMethod('supabase')}
                  style={{ marginRight: '5px' }}
                />
                ☁️ Supabase Cloud (Requires Setup)
              </label>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Add New Document</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCheckBucket}
                disabled={creatingBucket}
                style={{
                  padding: '6px 12px',
                  backgroundColor: creatingBucket ? '#6c757d' : '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: creatingBucket ? 'not-allowed' : 'pointer',
                  fontSize: '12px'
                }}
              >
                {creatingBucket ? 'Testing...' : '🧪 Test Storage Setup'}
              </button>
              <button
                onClick={() => {
                  const stored = localStorage.getItem('documents');
                  const docs = getDocuments();
                  alert(`LocalStorage Test:\n\nRaw data: ${stored ? 'Found' : 'Empty'}\nParsed docs: ${docs.length}\n\nCheck browser console for details.`);
                  console.log('LocalStorage debug:', { raw: stored, parsed: docs });
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🔍 Debug Storage
              </button>
              <button
                onClick={() => {
                  const result = ensureCertificateExists();
                  alert(`Certificate check completed!\n\nTotal documents: ${result.length}\nCertificate: Certificate Final - Joseph Nkiria Emmanuel\nDate: 24/07/2007\n\nCheck the documents list below.`);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📜 Add Certificate
              </button>
              <button
                onClick={() => {
                  if (confirm('Reset all documents and load only the certificate?\n\nThis will remove all existing documents.')) {
                    resetToDefaultDocuments();
                    alert('Documents reset! Only the certificate remains.\n\nDate: 24/07/2007\nTitle: Certificate Final - Joseph Nkiria Emmanuel');
                  }
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🔄 Reset to Certificate Only
              </button>
            </div>
          </div>
          <form onSubmit={handleAddDocument} style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Document Title"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                required
                style={{ 
                  padding: '8px', 
                  marginBottom: '10px', 
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              
              <input
                type="date"
                value={newDocument.createdAt}
                onChange={(e) => setNewDocument({ ...newDocument, createdAt: e.target.value })}
                required
                style={{ 
                  padding: '8px', 
                  marginBottom: '10px', 
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="fileInput" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Upload Document File (Optional):
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".txt,.md,.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif,.json,.csv,.xml"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  style={{ 
                    padding: '8px', 
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: uploading ? '#f5f5f5' : 'white'
                  }}
                />
                {selectedFile && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#e7f3ff', 
                    border: '1px solid #b3d9ff', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    <div><strong>📄 {selectedFile.name}</strong></div>
                    <div style={{ marginTop: '4px' }}>
                      <strong>Size:</strong> {formatFileSize(selectedFile.size)} | <strong>Type:</strong> {selectedFile.type || 'Unknown'}
                    </div>
                    {selectedFile.size > 5 * 1024 * 1024 && (
                      <div style={{ color: '#ff6b35', marginTop: '6px', fontWeight: 'bold' }}>
                        ⚠️ Large file - upload may take longer
                      </div>
                    )}
                    {selectedFile.size > 1024 * 1024 && selectedFile.type.startsWith('text/') && (
                      <div style={{ color: '#007bff', marginTop: '4px' }}>
                        💡 Will be compressed for local storage
                      </div>
                    )}
                  </div>
                )}
                <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
                  Maximum file size: 50MB. Supported formats: TXT, MD, DOC, DOCX, PDF, Images, JSON, CSV, XML<br/>
                  Large files (&gt;1MB) will be automatically compressed when stored locally.
                </div>
              </div>

              <textarea
                placeholder="Document Content (optional if file is uploaded, required if no file)"
                value={newDocument.content}
                onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
                rows={6}
                disabled={uploading}
                style={{ 
                  padding: '8px', 
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: uploading ? '#f5f5f5' : 'white'
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={uploading}
              style={{ 
                padding: '8px 15px', 
                backgroundColor: uploading ? '#6c757d' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1
              }}
            >
              {uploading ? 'Uploading...' : 'Add Document'}
            </button>
          </form>

          <h3>Existing Documents</h3>
          {documents.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              color: '#666'
            }}>
              No documents uploaded yet. Use the form above to upload your first document.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>File Info</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Storage</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <strong>{doc.title}</strong>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {doc.fileName ? (
                        <div>
                          <div>📄 {doc.fileName}</div>
                          <small style={{ color: '#666' }}>
                            {doc.fileSize ? formatFileSize(doc.fileSize) : 
                             doc.originalFileSize ? formatFileSize(doc.originalFileSize) : 'Unknown size'}
                            {doc.compressed && <span style={{ color: '#007bff' }}> (compressed)</span>}
                          </small>
                        </div>
                      ) : (
                        <span style={{ color: '#666', fontStyle: 'italic' }}>✏️ Manual Entry</span>
                      )}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {doc.storageType === 'supabase' && doc.fileUrl ? (
                        <div>
                          <a 
                            href={doc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none', fontSize: '12px' }}
                          >
                            ☁️ Cloud File
                          </a>
                          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                            Supabase Storage
                          </div>
                        </div>
                      ) : doc.storageType === 'local' && doc.fileData ? (
                        <div>
                          <span style={{ color: '#28a745', fontSize: '12px' }}>
                            💾 Local File
                          </span>
                          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                            Browser Storage
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#666', fontStyle: 'italic', fontSize: '12px' }}>📝 Text Only</span>
                      )}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doc.createdAt}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <button
                        onClick={() => handleRemoveDocument(doc.id, doc)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title={`Delete "${doc.title}"`}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;