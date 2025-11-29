import React, { useState, useEffect } from "react";
import { getDocuments } from "../data/mokedData";
import logoImage from "../assets/image.png";

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  // Load documents from localStorage on component mount and listen for changes
  useEffect(() => {
    const loadDocuments = () => {
      const loadedDocs = getDocuments();
      setDocuments(loadedDocs);
      console.log('Dashboard loaded documents:', loadedDocs.length, loadedDocs);
      
      // Also check localStorage directly
      const stored = localStorage.getItem('documents');
      console.log('Raw localStorage data:', stored);
    };

    // Load documents initially
    loadDocuments();
    
    // Listen for document changes
    const handleDocumentsChanged = () => {
      console.log('Documents changed event received');
      loadDocuments();
    };
    
    window.addEventListener('documentsChanged', handleDocumentsChanged);
    
    // Also keep a backup interval refresh every 5 seconds
    const interval = setInterval(loadDocuments, 5000);
    
    return () => {
      window.removeEventListener('documentsChanged', handleDocumentsChanged);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.fileName && doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoc(null);
  };

  const downloadFile = (doc: any) => {
    if (doc.fileData && doc.storageType === 'local') {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName || doc.title;
      link.click();
    } else if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || doc.title;
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <div style={{ 
      padding: "0", 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc",
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Modern Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "12px 0",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {/* Logo and Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img 
              src={logoImage} 
              alt="Logo" 
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "8px",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)"
              }}
            />
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: "24px", 
                fontWeight: "600",
                letterSpacing: "-0.025em"
              }}>
                Document Hub
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: "14px", 
                opacity: 0.8,
                fontWeight: "300"
              }}>
                Your Document Management System
              </p>
            </div>
          </div>
          
          {/* User Info and Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              padding: "8px 16px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "25px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                {(user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                Welcome, {user.username || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px"
      }}>
        {/* Hero Section */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "40px 30px",
          color: "white",
          marginBottom: "30px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "50%",
            right: "30px",
            transform: "translateY(-50%)",
            fontSize: "100px",
            opacity: "0.1"
          }}>
            📚
          </div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1 style={{ 
              margin: "0 0 10px 0", 
              fontSize: "32px", 
              fontWeight: "700" 
            }}>
              Welcome to Your Document Library
            </h1>
            <p style={{ 
              margin: "0 0 20px 0", 
              fontSize: "18px", 
              opacity: "0.9" 
            }}>
              Access and manage your documents with ease
            </p>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "15px 20px",
              borderRadius: "12px",
              display: "inline-block"
            }}>
              <span style={{ fontSize: "24px", fontWeight: "600" }}>
                {documents.length}
              </span>
              <span style={{ fontSize: "16px", marginLeft: "8px", opacity: "0.9" }}>
                Documents Available
              </span>
            </div>
          </div>
        </div>



      {/* Documents Table */}
      <div style={{
        backgroundColor: "white",
        margin: "0 20px 20px 20px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        {/* Table Header */}
        <div style={{
          backgroundColor: "#8B4B8A",
          color: "white",
          padding: "12px 0",
          display: "grid",
          gridTemplateColumns: "1fr 200px 150px",
          gap: "15px",
          alignItems: "center",
          paddingLeft: "15px",
          paddingRight: "15px",
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          <div>Document Name</div>
          <div>Date Of Issue</div>
          <div>View</div>
        </div>

        {/* Table Body */}
        {filteredDocuments.length === 0 ? (
          <div style={{
            padding: "40px",
            textAlign: "center",
            color: "#666",
            fontSize: "16px"
          }}>
            {documents.length === 0 
              ? "No documents available. Contact your administrator to upload documents."
              : `No documents match "${searchTerm}"`
            }
          </div>
        ) : (
          filteredDocuments.map((doc, index) => (
            <div
              key={doc.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px 150px",
                gap: "15px",
                padding: "12px 15px",
                borderBottom: index < filteredDocuments.length - 1 ? "1px solid #eee" : "none",
                alignItems: "center",
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                fontSize: "14px"
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", color: "#333" }}>
                  {doc.title}
                </div>
                {doc.fileName && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    📎 {doc.fileName}
                  </div>
                )}
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  {doc.storageType === 'supabase' ? "☁️ Cloud Storage" : 
                   doc.storageType === 'local' ? "💾 Local Storage" : 
                   "📝 Manual Entry"}
                </div>
              </div>
              <div style={{ color: "#666" }}>
                {formatDate(doc.createdAt)}
              </div>
              <div style={{ textAlign: "center" }}>
                {(doc.fileUrl || doc.fileData) ? (
                  <button
                    onClick={() => handleViewDocument(doc)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#8B4B8A",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                    title="View document"
                  >
                    👁️ View
                  </button>
                ) : (
                  <button
                    onClick={() => handleViewDocument(doc)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                    title="View text content"
                  >
                    📄 View
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Footer */}
        {filteredDocuments.length > 0 && (
          <div style={{
            padding: "10px 15px",
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #eee",
            fontSize: "12px",
            color: "#666",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              Page 1 of 1 ({filteredDocuments.length} items)
            </div>
            <div>
              🔗 Create Filter
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showModal && selectedDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90%',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#8B4B8A',
              color: 'white',
              borderRadius: '8px 8px 0 0'
            }}>
              <h3 style={{ margin: 0 }}>{selectedDoc.title}</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {(selectedDoc.fileData || selectedDoc.fileUrl) && (
                  <button
                    onClick={() => downloadFile(selectedDoc)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    📥 Download
                  </button>
                )}
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Content - Full View */}
            <div style={{ padding: '0' }}>
              {/* Debug info */}
              {console.log('Document debug:', {
                title: selectedDoc.title,
                fileType: selectedDoc.fileType,
                storageType: selectedDoc.storageType,
                fileUrl: selectedDoc.fileUrl,
                hasFileData: !!selectedDoc.fileData,
                fileName: selectedDoc.fileName
              })}
              
              {selectedDoc.fileUrl && selectedDoc.fileType === 'application/pdf' ? (
                // PDF Viewer for asset or supabase files
                <div style={{ 
                  height: '70vh',
                  width: '100%',
                  position: 'relative'
                }}>
                  <iframe
                    src={selectedDoc.fileUrl}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    title={selectedDoc.title}
                    onError={() => console.error('PDF iframe failed to load:', selectedDoc.fileUrl)}
                    onLoad={() => console.log('PDF iframe loaded successfully:', selectedDoc.fileUrl)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10
                  }}>
                    <button
                      onClick={() => window.open(selectedDoc.fileUrl, '_blank')}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      📄 Open in New Tab
                    </button>
                  </div>
                </div>
              ) : selectedDoc.fileData && selectedDoc.fileType?.includes('image') ? (
                // Image Viewer
                <div style={{ 
                  textAlign: 'center',
                  backgroundColor: '#000',
                  padding: '20px'
                }}>
                  <img 
                    src={selectedDoc.fileData} 
                    alt={selectedDoc.title}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '70vh',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ) : selectedDoc.fileData && selectedDoc.fileType?.includes('pdf') ? (
                // PDF Viewer for base64 data
                <div style={{ 
                  height: '70vh',
                  width: '100%'
                }}>
                  <iframe
                    src={selectedDoc.fileData}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    title={selectedDoc.title}
                  />
                </div>
              ) : selectedDoc.fileUrl && (selectedDoc.storageType === 'supabase' || selectedDoc.storageType === 'asset') ? (
                // File viewer (Supabase or Asset files)
                <div style={{ 
                  height: '70vh',
                  width: '100%'
                }}>
                  {selectedDoc.fileType?.includes('pdf') ? (
                    <iframe
                      src={selectedDoc.fileUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      title={selectedDoc.title}
                    />
                  ) : selectedDoc.fileType?.includes('image') ? (
                    <div style={{ 
                      textAlign: 'center',
                      backgroundColor: '#000',
                      padding: '20px',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={selectedDoc.fileUrl} 
                        alt={selectedDoc.title}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#f9f9f9',
                      height: '100%',
                      overflow: 'auto'
                    }}>
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#333'
                      }}>
                        {selectedDoc.content}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Text content viewer
                <div style={{
                  padding: '30px',
                  backgroundColor: '#fff',
                  minHeight: '60vh',
                  maxHeight: '70vh',
                  overflow: 'auto'
                }}>
                  <div style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333',
                    letterSpacing: '0.5px'
                  }}>
                    {selectedDoc.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
