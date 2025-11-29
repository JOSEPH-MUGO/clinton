import React, { useState } from "react";
import { documents } from "../data/mokedData";

const Dashboard: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Dashboard</h1>
        <div>
          <span>Welcome, {user.username}!</span>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "15px",
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
          {user.role === "admin" && (
            <button
              onClick={() => (window.location.href = "/admin")}
              style={{
                marginLeft: "15px",
                padding: "5px 10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Document List */}
        <div style={{ width: "30%" }}>
          <h3>Documents</h3>
          <div style={{ border: "1px solid #ddd", borderRadius: "4px" }}>
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  backgroundColor:
                    selectedDoc.id === doc.id ? "#f8f9fa" : "white",
                }}
              >
                <strong>{doc.title}</strong>
                <br />
                <small>Created: {doc.createdAt}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Document Viewer */}
        <div style={{ width: "70%" }}>
          <h3>{selectedDoc.title}</h3>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "20px",
              minHeight: "400px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {selectedDoc.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
