import React, { useState } from 'react';
import styles from './TelaCadastro.module.css';
import googleIcon from '../../assets/google-icon.svg';
import githubIcon from '../../assets/github-icon.svg';

export const TelaCadastro: React.FC<{ onLoginSuccess?: (email: string) => void }> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isLogin ? 'http://localhost:8080/api/users/login' : 'http://localhost:8080/api/users/register';
      const body = isLogin ? { email, senha } : { nome, sobrenome, email, senha };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        if (isLogin) {
          setMessage('Login efetuado com sucesso!');
          if (onLoginSuccess) onLoginSuccess(email);
        } else {
          setMessage('Conta criada com sucesso! Faça login.');
          setIsLogin(true); // Redireciona pra aba de login
        }
      } else {
        const errorMsg = await response.text();
        setMessage(`Erro: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor', error);
      setMessage('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{isLogin ? 'Entrar' : 'Criar Conta'}</h1>
        <p className={styles.subtitle}>{isLogin ? 'Insira seus dados para entrar.' : 'Insira seus dados pessoais para criar sua conta.'}</p>

        <div className={styles.socialButtons}>
          <button type="button" className={styles.socialBtn}>
            <img src={googleIcon} alt="Google" className={styles.socialIconImg} /> Google
          </button>
          <button type="button" className={styles.socialBtn}>
            <img src={githubIcon} alt="Github" className={`${styles.socialIconImg} ${styles.githubIconImg}`} /> Github
          </button>
        </div>

        <div className={styles.divider}>
          <span>Ou</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Nome</label>
                <input type="text" placeholder="ex. João" value={nome} onChange={e => setNome(e.target.value)} required={!isLogin} />
              </div>
              <div className={styles.inputGroup}>
                <label>Sobrenome</label>
                <input type="text" placeholder="ex. Francisco" value={sobrenome} onChange={e => setSobrenome(e.target.value)} required={!isLogin} />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="ex. joao@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
              <button type="button" className={styles.eyeToggle} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {message && <p className={styles.message} style={{ color: message.startsWith('Erro') ? '#E50914' : '#2ecc71' }}>{message}</p>}

          <button type="submit" className={styles.submitBtn}>{isLogin ? 'Entrar' : 'Cadastrar'}</button>
        </form>

        <p className={styles.footerText}>
          {isLogin ? 'Novo por aqui?' : 'Já tem uma conta?'}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setMessage(''); }}>
            {isLogin ? 'Assine agora' : 'Entrar'}
          </a>
        </p>
      </div>
    </div>
  );
};
