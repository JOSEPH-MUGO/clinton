import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from "../data/mokedData";

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
      width: '100vw',
      margin: 0,
      padding: '20px',
      backgroundColor: '#f5f5f5',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '400px', 
        padding: window.innerWidth <= 480 ? '30px 20px' : '40px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        margin: window.innerWidth <= 480 ? '0 10px' : '0'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500',
              color: '#555'
            }}>
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#333333',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500',
              color: '#555'
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#333333',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
            />
          </div>
          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: '#ffe6e6',
              border: '1px solid #ffcccc',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '14px'
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
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
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