import React, { useState } from "react";
import { documents } from "../data/mokedData";

const Dashboard: React.FC = () => {
  const [selectedDoc] = useState(documents[0]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "Arial" }}>
      
      {/* TOP HEADER */}
      <div style={{ background: "#4a003d", padding: "10px 20px", color: "white" }}>
        <h2 style={{ margin: 0 }}>Mogosi Johnson Wambura: Documents</h2>
      </div>

      {/* NAV BAR */}
      <div
        style={{
          background: "#7c004f",
          padding: "10px 0",
          display: "flex",
          gap: "40px",
          justifyContent: "center",
        }}
      >
        <button style={navBtn}>Home</button>
        <button style={navBtn}>Help</button>
        <button style={navBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: "900px", margin: "20px auto", textAlign: "center" }}>
        
        {/* TABLE HEADER */}
        <div
          style={{
            background: "#7c004f",
            color: "white",
            padding: "8px",
            fontWeight: "bold",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderRadius: "5px 5px 0 0",
          }}
        >
          <span>Document Name</span>
          <span>Date Of Issue</span>
          <span>Product Name</span>
        </div>

        {/* TABLE ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "12px",
            border: "1px solid #ccc",
          }}
        >
          <span>{selectedDoc.title}</span>
          <span>{selectedDoc.createdAt}</span>
          <span>{selectedDoc.title}</span>
        </div>

        {/* FOOTER AREA */}
        <p style={{ marginTop: "40px", color: "#777" }}>
          Premiercert+ from Hague Security Print <br />
          <small>This site is powered by Isopyre.</small>
        </p>
      </div>
    </div>
  );
};

const navBtn: React.CSSProperties = {
  background: "transparent",
  color: "white",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

export default Dashboard;
