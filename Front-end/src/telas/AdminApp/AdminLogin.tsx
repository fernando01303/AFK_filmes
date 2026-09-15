import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação simples de login seguro
    if (email === 'admin@admin.com' && password === 'admin123') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas. Acesso negado.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#16171d', // Cor de fundo do dark mode
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        backgroundColor: '#1f2028',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.4) 0 10px 15px -3px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: '#f3f4f6', textAlign: 'center', margin: '0 0 24px 0', fontSize: '28px' }}>Admin Login</h1>
        
        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: '#ff4d4d',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 0, 0, 0.3)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #2e303a',
                backgroundColor: '#16171d',
                color: '#f3f4f6',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #2e303a',
                backgroundColor: '#16171d',
                color: '#f3f4f6',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button 
            type="submit"
            style={{
              marginTop: '10px',
              padding: '12px',
              backgroundColor: '#c084fc', // accent color do projeto
              color: '#16171d', // texto escuro no botão para contraste
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'filter 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};
