import React, { useState } from 'react';
import { users, documents, addUser, addDocument } from '../data/mokedData';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'documents'>('users');
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' as 'user' | 'admin' });
  const [newDocument, setNewDocument] = useState({ title: '', content: '' });

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

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument(newDocument);
    setNewDocument({ title: '', content: '' });
    alert('Document added successfully!');
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
          <h3>Add New Document</h3>
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
              <textarea
                placeholder="Document Content"
                value={newDocument.content}
                onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
                required
                rows={6}
                style={{ 
                  padding: '8px', 
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 15px' }}>
              Add Document
            </button>
          </form>

          <h3>Existing Documents</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doc.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doc.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;