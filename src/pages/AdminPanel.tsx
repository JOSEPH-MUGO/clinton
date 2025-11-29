import React, { useState } from 'react';
import { documents, addDocument } from '../data/mokedData';


const AdminPanel: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    addDocument({
      title: fileName,
      content: fileContent || 'File uploaded successfully'
    });
    
    setFileName('');
    setFileContent('');
    alert('File uploaded successfully!');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string || 'File content loaded');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: 0,
          color: '#2d3748',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Admin File Upload
        </h1>
        <div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{
              marginRight: '15px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          marginBottom: '25px',
          color: '#2d3748',
          fontSize: '22px',
          fontWeight: '600'
        }}>
          Upload New File
        </h2>
        
        <form onSubmit={handleFileUpload}>
          {/* File Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600',
              color: '#4a5568'
            }}>
              Select File
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".txt,.pdf,.doc,.docx,.md"
              style={{ 
                width: '100%',
                padding: '12px',
                border: '2px dashed #cbd5e0',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}
            />
            <small style={{ 
              display: 'block',
              marginTop: '5px',
              color: '#718096'
            }}>
              Supported formats: .txt, .pdf, .doc, .docx, .md
            </small>
          </div>

          {/* File Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600',
              color: '#4a5568'
            }}>
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name or use uploaded file name"
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* File Content Preview (Optional) */}
          {fileContent && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '600',
                color: '#4a5568'
              }}>
                File Content Preview
              </label>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={6}
                placeholder="File content will appear here..."
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          )}

          {/* Upload Button */}
          <button 
            type="submit"
            disabled={!fileName.trim()}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: fileName.trim() ? '#007bff' : '#a0aec0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: fileName.trim() ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
          >
            📁 Upload File
          </button>
        </form>
      </div>

      {/* Uploaded Files List */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          marginBottom: '25px',
          color: '#2d3748',
          fontSize: '22px',
          fontWeight: '600'
        }}>
          Uploaded Files ({documents.length})
        </h2>
        
        {documents.length === 0 ? (
          <div style={{ 
            textAlign: 'center',
            padding: '40px',
            color: '#718096'
          }}>
            No files uploaded yet
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gap: '15px'
          }}>
            {documents.map(doc => (
              <div
                key={doc.id}
                style={{
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ 
                    margin: '0 0 5px 0',
                    color: '#2d3748',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    📄 {doc.title}
                  </h4>
                  <p style={{ 
                    margin: 0,
                    color: '#718096',
                    fontSize: '14px'
                  }}>
                    Uploaded on: {doc.createdAt}
                  </p>
                </div>
                <div style={{ 
                  color: '#718096',
                  fontSize: '14px'
                }}>
                  {doc.content.length > 50 
                    ? `${doc.content.substring(0, 50)}...` 
                    : doc.content
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
