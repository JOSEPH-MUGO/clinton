import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [docName, setDocName] = useState("");
  const [docDate, setDocDate] = useState("");
  const [docType, setDocType] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");

  const saveDocument = () => {
    const documentData = { docName, docDate, docType };
    localStorage.setItem("document", JSON.stringify(documentData));
    alert("Document saved");
  };

  const addUser = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ username: newUser, password: newPass, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
    alert("User added");
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <h4>Add Document</h4>
      <input
        placeholder="Document Name"
        onChange={(e) => setDocName(e.target.value)}
      />
      <br />
      <input type="date" onChange={(e) => setDocDate(e.target.value)} />
      <br />
      <input
        placeholder="Product Name"
        onChange={(e) => setDocType(e.target.value)}
      />
      <br />
      <button onClick={saveDocument}>Save Document</button>

      <hr />

      <h4>Add User</h4>
      <input
        placeholder="Username"
        onChange={(e) => setNewUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setNewPass(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>

      <br />
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
