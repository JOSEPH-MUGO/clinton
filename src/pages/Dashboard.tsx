import React, { useState, useEffect } from "react";
import { getDocuments } from "../data/mokedData";
import logoImage from "../assets/image.png";

const Dashboard: React.FC = () => {
  const [searchTerm] = useState(''); // Search functionality
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

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
    console.log('Viewing document:', doc);
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          {/* Logo and Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px", minWidth: "0" }}>
            <img 
              src={logoImage} 
              alt="Logo" 
              style={{ 
                width: window.innerWidth <= 768 ? "32px" : "40px", 
                height: window.innerWidth <= 768 ? "32px" : "40px", 
                borderRadius: "8px",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)",
                flexShrink: 0
              }}
            />
            <div style={{ minWidth: "0" }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: window.innerWidth <= 768 ? "18px" : "24px", 
                fontWeight: "600",
                letterSpacing: "-0.025em",
                whiteSpace: window.innerWidth <= 480 ? "nowrap" : "normal",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                Document Hub
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: window.innerWidth <= 768 ? "12px" : "14px", 
                opacity: 0.8,
                fontWeight: "300",
                display: window.innerWidth <= 480 ? "none" : "block"
              }}>
                Your Document Management System
              </p>
            </div>
          </div>
          
          {/* User Info and Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: window.innerWidth <= 768 ? "10px" : "20px", flexShrink: 0 }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              padding: window.innerWidth <= 768 ? "6px 12px" : "8px 16px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "25px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{
                width: window.innerWidth <= 768 ? "28px" : "32px",
                height: window.innerWidth <= 768 ? "28px" : "32px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                fontWeight: "600"
              }}>
                {(user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span style={{ 
                fontSize: window.innerWidth <= 768 ? "12px" : "14px", 
                fontWeight: "500",
                display: window.innerWidth <= 480 ? "none" : "inline"
              }}>
                Welcome, {user.username || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                padding: window.innerWidth <= 768 ? "8px 15px" : "10px 20px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                fontWeight: "500",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                minWidth: window.innerWidth <= 480 ? "auto" : "auto",
                whiteSpace: "nowrap"
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.2)";
                (e.target as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)";
                (e.target as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {window.innerWidth <= 480 ? "Out" : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: window.innerWidth <= 768 ? "20px 10px" : "30px 20px"
      }}>
        {/* Hero Section */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: window.innerWidth <= 768 ? "30px 20px" : "40px 30px",
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
              fontSize: window.innerWidth <= 768 ? "24px" : "32px", 
              fontWeight: "700",
              lineHeight: "1.2"
            }}>
              Welcome to Your Document Library
            </h1>
            <p style={{ 
              margin: "0 0 20px 0", 
              fontSize: window.innerWidth <= 768 ? "16px" : "18px", 
              opacity: "0.9",
              lineHeight: "1.4"
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
        margin: window.innerWidth <= 768 ? "0 10px 20px 10px" : "0 20px 20px 20px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        {/* Table Header - Hide on mobile, show as cards instead */}
        <div style={{
          backgroundColor: "#8B4B8A",
          color: "white",
          padding: "12px 0",
          display: window.innerWidth <= 768 ? "none" : "grid",
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
                display: window.innerWidth <= 768 ? "block" : "grid",
                gridTemplateColumns: window.innerWidth <= 768 ? "none" : "1fr 200px 150px",
                gap: "15px",
                padding: window.innerWidth <= 768 ? "20px 15px" : "12px 15px",
                borderBottom: index < filteredDocuments.length - 1 ? "1px solid #eee" : "none",
                alignItems: "center",
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                fontSize: "14px",
                border: window.innerWidth <= 768 ? "1px solid #eee" : "none",
                margin: window.innerWidth <= 768 ? "10px" : "0",
                borderRadius: window.innerWidth <= 768 ? "8px" : "0"
              }}
            >
              <div style={{ marginBottom: window.innerWidth <= 768 ? "15px" : "0" }}>
                <div style={{ fontWeight: "bold", color: "#333", fontSize: window.innerWidth <= 768 ? "16px" : "14px" }}>
                  {doc.title}
                </div>
                {doc.fileName && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    📎 {doc.fileName}
                  </div>
                )}
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  {doc.storageType === 'supabase' ? "☁️ Cloud Storage" : 
                   doc.storageType === 'local' ? "💾 Local Storage" : 
                   "📝 Manual Entry"}
                </div>
                {window.innerWidth <= 768 && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                    <strong>Date:</strong> {formatDate(doc.createdAt)}
                  </div>
                )}
              </div>
              {window.innerWidth > 768 && (
                <div style={{ color: "#666" }}>
                  {formatDate(doc.createdAt)}
                </div>
              )}
              <div style={{ 
                textAlign: window.innerWidth <= 768 ? "left" : "center",
                marginTop: window.innerWidth <= 768 ? "10px" : "0"
              }}>
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
            borderRadius: isMobile ? '0' : '8px',
            width: isMobile ? '100%' : '90%',
            maxWidth: isMobile ? '100%' : '800px',
            height: isMobile ? '100vh' : 'auto',
            maxHeight: isMobile ? '100vh' : '90%',
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

            {/* Document Content - Mobile Optimized */}
            <div style={{ padding: '0' }}>
              {(() => {
                const contentHeight = isMobile ? 'calc(100vh - 140px)' : '70vh';
                
                // Debug logging
                console.log('Document viewer - Mobile:', isMobile, 'Document:', {
                  title: selectedDoc.title,
                  fileName: selectedDoc.fileName,
                  fileType: selectedDoc.fileType,
                  hasFileUrl: !!selectedDoc.fileUrl,
                  hasFileData: !!selectedDoc.fileData,
                  storageType: selectedDoc.storageType
                });
                
                // For mobile, always show a simple interface
                if (isMobile) {
                  return (
                    <div style={{
                      padding: '30px 20px',
                      textAlign: 'center',
                      backgroundColor: '#f8f9fa',
                      height: contentHeight,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                        {selectedDoc.fileName?.toLowerCase().endsWith('.pdf') || selectedDoc.fileType === 'application/pdf' ? '📄' : 
                         selectedDoc.fileType?.includes('image') ? '🖼️' : '📝'}
                      </div>
                      <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '18px' }}>
                        {selectedDoc.title}
                      </h3>
                      
                      {/* Always show content if available */}
                      {selectedDoc.content && (
                        <div style={{
                          backgroundColor: '#fff',
                          padding: '20px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          maxHeight: '200px',
                          overflow: 'auto',
                          width: '100%',
                          textAlign: 'left',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#333'
                        }}>
                          {selectedDoc.content}
                        </div>
                      )}
                      
                      {/* Try View in Modal option */}
                      {(selectedDoc.fileUrl || selectedDoc.fileData) && (
                        <div style={{
                          backgroundColor: '#fff3cd',
                          padding: '15px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          width: '100%',
                          textAlign: 'center',
                          fontSize: '13px',
                          color: '#856404',
                          border: '1px solid #ffeaa7'
                        }}>
                          <button
                            onClick={() => {
                              // Create an inline viewer
                              const viewerDiv = document.createElement('div');
                              viewerDiv.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: rgba(0,0,0,0.9);
                                z-index: 10000;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              `;
                              
                              const closeBtn = document.createElement('button');
                              closeBtn.innerHTML = '✕';
                              closeBtn.style.cssText = `
                                position: absolute;
                                top: 20px;
                                right: 20px;
                                background: #fff;
                                border: none;
                                padding: 10px 15px;
                                border-radius: 50%;
                                cursor: pointer;
                                font-size: 16px;
                                z-index: 10001;
                              `;
                              closeBtn.onclick = () => document.body.removeChild(viewerDiv);
                              
                              const fileToOpen = selectedDoc.fileUrl || selectedDoc.fileData;
                              const iframe = document.createElement('iframe');
                              iframe.src = fileToOpen;
                              iframe.style.cssText = `
                                width: 95%;
                                height: 95%;
                                border: none;
                                background: white;
                                border-radius: 8px;
                              `;
                              
                              viewerDiv.appendChild(closeBtn);
                              viewerDiv.appendChild(iframe);
                              document.body.appendChild(viewerDiv);
                            }}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#ffc107',
                              color: '#856404',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            🔍 Try View in Modal
                          </button>
                          <div style={{ marginTop: '8px', fontSize: '11px' }}>
                            Alternative viewer - may load faster on some devices
                          </div>
                        </div>
                      )}
                      
                      {/* File actions */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {(selectedDoc.fileUrl || selectedDoc.fileData) && (
                          <>
                            {/* Quick View Button */}
                            <button
                              onClick={() => {
                                const fileToOpen = selectedDoc.fileUrl || selectedDoc.fileData;
                                window.open(fileToOpen, '_blank');
                              }}
                              style={{
                                padding: '10px 18px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              🔗 Quick View
                            </button>
                            
                            {/* Open With Button */}
                            <button
                              onClick={() => {
                                const fileToOpen = selectedDoc.fileUrl || selectedDoc.fileData;
                                
                                // Create a temporary link element for better browser handling
                                const link = document.createElement('a');
                                link.href = fileToOpen;
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                
                                // Add download attribute for PDFs to give users more control
                                if (selectedDoc.fileName?.toLowerCase().endsWith('.pdf') || selectedDoc.fileType === 'application/pdf') {
                                  link.download = selectedDoc.fileName || selectedDoc.title + '.pdf';
                                }
                                
                                // Trigger the link
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              style={{
                                padding: '10px 18px',
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              📱 Open With...
                            </button>
                            
                            {/* Download Button */}
                            <button
                              onClick={() => downloadFile(selectedDoc)}
                              style={{
                                padding: '10px 18px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              📥 Download
                            </button>
                            
                            {/* Share Button (if supported) */}
                            {navigator.share && (
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.share({
                                      title: selectedDoc.title,
                                      text: `Check out this document: ${selectedDoc.title}`,
                                      url: selectedDoc.fileUrl || window.location.href
                                    });
                                  } catch (err) {
                                    console.log('Sharing not supported or cancelled');
                                  }
                                }}
                                style={{
                                  padding: '10px 18px',
                                  backgroundColor: '#6c757d',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '600'
                                }}
                              >
                                📤 Share
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
                
                // Desktop rendering
                const isPDF = selectedDoc.fileType === 'application/pdf' || 
                             selectedDoc.fileName?.toLowerCase().endsWith('.pdf');
                const isImage = selectedDoc.fileType?.includes('image') || 
                               /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(selectedDoc.fileName || '');
                
                if (isPDF) {
                  const pdfSrc = selectedDoc.fileUrl || selectedDoc.fileData;
                  return (
                    <div style={{ height: contentHeight, width: '100%', position: 'relative' }}>
                      <iframe
                        src={pdfSrc}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={selectedDoc.title}
                      />
                    </div>
                  );
                } else if (isImage) {
                  const imageSrc = selectedDoc.fileUrl || selectedDoc.fileData;
                  return (
                    <div style={{ 
                      textAlign: 'center',
                      backgroundColor: '#000',
                      padding: '20px',
                      height: contentHeight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={imageSrc} 
                        alt={selectedDoc.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div style={{
                      padding: '30px',
                      backgroundColor: '#fff',
                      height: contentHeight,
                      overflow: 'auto'
                    }}>
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'Georgia, serif',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#333'
                      }}>
                        {selectedDoc.content || 'No content available for this document.'}
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default Dashboard;
