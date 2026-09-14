import React, { useState } from 'react';
import styles from './PaginaInicial.module.css';
import animacao from '../../assets/animacao.webm';

interface PaginaInicialProps {
  onLoginClick: () => void;
}

export const PaginaInicial: React.FC<PaginaInicialProps> = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginClick(); 
  };

  const trendingMovies = [
    { id: 1, img: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUrmUe44Y8g7hX4J9o90.jpg' },
    { id: 2, img: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEN21.jpg' },
    { id: 3, img: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg' },
    { id: 4, img: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg' },
    { id: 5, img: 'https://image.tmdb.org/t/p/w500/1X7vow16X7CnCoexXh4H4F2yDJv.jpg' },
  ];

  return (
    <div className={styles.landingContainer}>
      <div className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <video className={styles.heroVideo} src={animacao} autoPlay loop muted playsInline />
          <div className={styles.heroGradient}></div>
        </div>
        
        <header className={styles.header}>
          <div className={styles.logo}>AFK</div>
          <div className={styles.headerActions}>
            <select className={styles.languageSelect}>
              <option value="pt">Português</option>
              <option value="en">English</option>
            </select>
            <button className={styles.loginBtn} onClick={onLoginClick}>Entrar</button>
          </div>
        </header>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Filmes, séries e muito<br />mais, sem limites</h1>
          <p className={styles.heroSubtitle}>A partir de R$ 20,90. Cancele quando quiser.</p>
          <p className={styles.heroText}>Quer assistir? Informe seu email para criar ou reiniciar sua assinatura.</p>
          
          <form className={styles.emailForm} onSubmit={handleStart}>
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.startBtn}>Vamos lá {'>'}</button>
          </form>
        </div>

        {/* Separador Curvo */}
        <div className={styles.curveContainer}>
          <div className={styles.curveElement}></div>
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Em alta</h2>
        <div className={styles.trendingList}>
          {trendingMovies.map((movie, index) => (
            <div key={movie.id} className={styles.trendingItem}>
              <div className={styles.trendingNumber}>{index + 1}</div>
              <div className={styles.trendingPoster}>
                <img src={movie.img} alt={`Top ${index + 1}`} className={styles.posterImage} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Mais motivos para assinar</h2>
        <div className={styles.reasonsGrid}>
          <div className={styles.reasonCard}>
            <h3>Aproveite na TV</h3>
            <p>Assista em Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, aparelhos de Blu-ray e outros dispositivos.</p>
            <div className={styles.cardIcon}>📺</div>
          </div>
          <div className={styles.reasonCard}>
            <h3>Baixe séries para assistir offline</h3>
            <p>Salve seus títulos favoritos e sempre tenha algo para assistir.</p>
            <div className={styles.cardIcon}>⬇️</div>
          </div>
          <div className={styles.reasonCard}>
            <h3>Assista onde quiser</h3>
            <p>Assista a quantos filmes e séries quiser no celular, tablet, laptop e TV.</p>
            <div className={styles.cardIcon}>🔭</div>
          </div>
          <div className={styles.reasonCard}>
            <h3>Crie perfis para crianças</h3>
            <p>Deixe as crianças se aventurarem com seus personagens favoritos em um espaço feito só para elas, sem pagar a mais por isso.</p>
            <div className={styles.cardIcon}>👶</div>
          </div>
        </div>
      </div>

      <div className={styles.footerSection}>
        <div className={styles.bottomCallToAction}>
           <p>Quer assistir? Informe seu email para criar ou reiniciar sua assinatura.</p>
           <form className={styles.emailForm} onSubmit={handleStart}>
              <div className={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.startBtn}>Vamos lá {'>'}</button>
            </form>
        </div>
        
        <footer className={styles.footer}>
          <p className={styles.footerCall}>Dúvidas? Ligue para <a href="tel:0800-591-8943">0800 591 8943</a></p>
          <ul className={styles.footerLinks}>
            <li><a href="#">Perguntas frequentes</a></li>
            <li><a href="#">Central de Ajuda</a></li>
            <li><a href="#">Conta</a></li>
            <li><a href="#">Media Center</a></li>
            <li><a href="#">Relações com investidores</a></li>
            <li><a href="#">Carreiras</a></li>
            <li><a href="#">Resgatar cartão pré-pago</a></li>
            <li><a href="#">Comprar cartão pré-pago</a></li>
            <li><a href="#">Formas de assistir</a></li>
            <li><a href="#">Termos de Uso</a></li>
            <li><a href="#">Privacidade</a></li>
            <li><a href="#">Preferências de cookies</a></li>
            <li><a href="#">Informações corporativas</a></li>
            <li><a href="#">Entre em contato</a></li>
            <li><a href="#">Teste de velocidade</a></li>
            <li><a href="#">Avisos legais</a></li>
            <li><a href="#">Só na AFK</a></li>
          </ul>
          <div className={styles.footerLanguage}>
            <select className={styles.languageSelect}>
              <option value="pt">Português</option>
              <option value="en">English</option>
            </select>
          </div>
          <p className={styles.footerBrand}>AFK Brasil</p>
        </footer>
      </div>
    </div>
  );
};
