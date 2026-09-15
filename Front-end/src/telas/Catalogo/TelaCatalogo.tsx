import { useState, useEffect } from 'react';
import styles from './TelaCatalogo.module.css';
import { Search, Bell, User, Play, Info } from 'lucide-react';
import { Linha } from './Linha';
import { DetalhesFilme } from '../DetalhesFilme/DetalhesFilme';

export const TelaCatalogo: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/filmes');
        const data = await res.json();
        setMovies(data);
      } catch (e) {
        console.error('Failed to fetch movies', e);
      }
    };
    fetchMovies();
  }, []);

  // Mock data for display if API fails or returns empty
  const mockEmAlta = [
    { id: 'm1', titulo: 'Oppenheimer', cover: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=400&h=225' },
    { id: 'm2', titulo: 'Barbie', cover: '' },
    { id: 'm3', titulo: 'Interestelar', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=225' },
    { id: 'm4', titulo: 'Matrix', cover: '' },
    { id: 'm5', titulo: 'Inception', cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=225' },
    { id: 'm6', titulo: 'The Batman', cover: '' },
    { id: 'm7', titulo: 'Duna', cover: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=400&h=225' },
    { id: 'm8', titulo: 'Tenet', cover: '' },
    { id: 'm9', titulo: 'Vingadores', cover: '' },
  ];

  const mockLancamentos = [
    { id: 'l1', titulo: 'Duna: Parte 2', cover: '' },
    { id: 'l2', titulo: 'Pobres Criaturas', cover: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400&h=225' },
    { id: 'l3', titulo: 'Assassinos da Lua das Flores', cover: '' },
    { id: 'l4', titulo: 'Anatomia de Uma Queda', cover: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400&h=225' },
    { id: 'l5', titulo: 'Vidas Passadas', cover: '' },
    { id: 'l6', titulo: 'Ficção Americana', cover: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?auto=format&fit=crop&q=80&w=400&h=225' },
    { id: 'l7', titulo: 'O Menino e a Garça', cover: '' },
    { id: 'l8', titulo: 'Godzilla Minus One', cover: '' },
  ];

  // Agrupa os filmes recebidos da API por categoria
  const moviesByCategory = movies.reduce((acc, movie) => {
    const catName = movie.categoria?.nome || 'Outros';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push({
      id: movie.id,
      titulo: movie.titulo,
      cover: movie.capa || movie.cover || '', // Se no futuro o backend tiver capa
      duration: movie.duracaoMinutos ? `${movie.duracaoMinutos}m` : undefined,
      genres: [catName]
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Se a API retornou filmes, renderiza uma Row para cada categoria encontrada
  // Se estiver vazio, usa os dados mock para demonstração
  const hasApiMovies = movies.length > 0;
  
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  if (selectedMovie) {
    return <DetalhesFilme movieData={selectedMovie} onBack={() => setSelectedMovie(null)} />;
  }

  return (
    <div className={styles.catalogContainer}>
      {/* Navbar */}
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>AFK</div>
          <ul className={styles.navLinks}>
            <li className={styles.active}>Início</li>
            <li>Séries</li>
            <li>Filmes</li>
            <li>Bombando</li>
            <li>Minha lista</li>
          </ul>
        </div>
        <div className={styles.navRight}>
          <Search className={styles.navIcon} size={20} />
          <Bell className={styles.navIcon} size={20} />
          <div style={{ cursor: 'pointer' }} onClick={onLogout} title="Sair">
            <User className={styles.navIcon} size={20} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div 
        className={styles.hero} 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1920&h=1080')` 
        }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Stranger Things</h1>
          <p className={styles.heroDescription}>
            Quando um garoto desaparece, a cidade toda participa nas buscas. Mas o que encontram são segredos, forças sobrenaturais e uma menina.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.playBtn}>
              <Play size={24} fill="currentColor" /> Assistir
            </button>
            <button className={styles.moreInfoBtn} onClick={() => setSelectedMovie({
              titulo: 'Stranger Things', 
              anoLancamento: '2016', 
              genres: ['Mistério', 'Ficção', 'Drama'],
              cover: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=400&h=600'
            })}>
              <Info size={24} /> Mais informações
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Rows */}
      <div className={styles.rowsWrapper}>
        {hasApiMovies ? (
          Object.entries(moviesByCategory).map(([categoryName, catMovies]) => (
            <Linha key={categoryName} title={categoryName} movies={catMovies as any} onMovieClick={setSelectedMovie} />
          ))
        ) : (
          <>
            <Linha title="Em Alta" movies={mockEmAlta} onMovieClick={setSelectedMovie} />
            <Linha title="Lançamentos" movies={mockLancamentos} onMovieClick={setSelectedMovie} />
            <Linha title="Ação e Aventura" movies={mockEmAlta.slice().reverse()} onMovieClick={setSelectedMovie} />
            <Linha title="Minha Lista" movies={mockLancamentos.slice(2, 6)} onMovieClick={setSelectedMovie} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerSocials}>
           {/* Placeholder for socials */}
           <div className={styles.socialIcon}>F</div>
           <div className={styles.socialIcon}>I</div>
           <div className={styles.socialIcon}>T</div>
           <div className={styles.socialIcon}>Y</div>
        </div>
        <ul className={styles.footerLinks}>
          <li><a href="#">Idioma e legendas</a></li>
          <li><a href="#">Audiodescrição</a></li>
          <li><a href="#">Centro de ajuda</a></li>
          <li><a href="#">Cartões pré-pagos</a></li>
          <li><a href="#">Imprensa</a></li>
          <li><a href="#">Relações com investidores</a></li>
          <li><a href="#">Carreiras</a></li>
          <li><a href="#">Termos de uso</a></li>
          <li><a href="#">Privacidade</a></li>
          <li><a href="#">Avisos legais</a></li>
          <li><a href="#">Preferências de cookies</a></li>
          <li><a href="#">Informações corporativas</a></li>
          <li><a href="#">Entre em contato</a></li>
        </ul>
        <button className={styles.serviceCodeBtn}>Código do serviço</button>
        <p className={styles.copyright}>© 2026 AFK Filmes Brasil.</p>
      </footer>
    </div>
  );
};
