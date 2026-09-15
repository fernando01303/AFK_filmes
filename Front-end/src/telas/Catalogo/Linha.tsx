import { useRef, useState } from 'react';
import styles from './Linha.module.css';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';

interface Movie {
  id: string | number;
  titulo: string;
  cover?: string;
  match?: string;
  duration?: string;
  genres?: string[];
}

interface LinhaProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export const Linha: React.FC<LinhaProps> = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleScroll = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.rowContainer}>
      <h2 className={styles.rowTitle}>{title}</h2>
      <div className={styles.sliderWrapper}>
        <div 
          className={`${styles.sliderArrow} ${styles.leftArrow} ${!isMoved ? styles.hidden : ''}`} 
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft size={40} />
        </div>
        
        <div className={styles.rowPosters} ref={rowRef}>
          {movies.map((m, index) => (
            <div key={m.id || index} className={styles.posterWrapper}>
              <div className={styles.poster} onClick={() => onMovieClick && onMovieClick(m)}>
                {m.cover ? (
                  <img 
                    src={m.cover} 
                    alt={m.titulo} 
                    className={styles.posterImg} 
                  />
                ) : (
                  <div className={styles.noCover}>
                    <span>Capa não disponível no momento</span>
                  </div>
                )}
                
                <div className={styles.hoverCard}>
                  <div className={styles.hoverImageWrapper}>
                    {m.cover ? (
                      <img 
                        src={m.cover} 
                        alt={m.titulo} 
                      />
                    ) : (
                      <div className={styles.noCoverHover}>
                        <span>Capa indisponível</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.hoverInfo}>
                    <div className={styles.controls}>
                      <div className={styles.leftControls}>
                        <button className={styles.iconBtn} style={{backgroundColor: 'white', color: 'black'}}><Play size={16} fill="currentColor" /></button>
                        <button className={styles.iconBtn}><Plus size={16} /></button>
                        <button className={styles.iconBtn}><ThumbsUp size={16} /></button>
                      </div>
                      <div className={styles.rightControls}>
                         <button className={styles.iconBtn}><ChevronDown size={16} /></button>
                      </div>
                    </div>
                    <div className={styles.metadata}>
                      <span className={styles.match}>{m.match || '98% Relevante'}</span>
                      <span className={styles.age}>16</span>
                      <span className={styles.duration}>{m.duration || '2h 10m'}</span>
                    </div>
                    <div className={styles.genres}>
                      {(m.genres || ['Suspense', 'Ação', 'Ficção']).map((g, i) => (
                        <span key={i}>{g}{i < (m.genres?.length || 3) - 1 ? ' • ' : ''}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div 
          className={`${styles.sliderArrow} ${styles.rightArrow}`} 
          onClick={() => handleScroll('right')}
        >
          <ChevronRight size={40} />
        </div>
      </div>
    </div>
  );
};
