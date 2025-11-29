import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/mockedData';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                marginTop: '5px',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                marginTop: '5px',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#ffe6e6',
              border: '1px solid #ffcccc',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
