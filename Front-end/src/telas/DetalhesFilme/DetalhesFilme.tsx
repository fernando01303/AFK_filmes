import { useState, useEffect } from 'react';
import styles from './DetalhesFilme.module.css';
import { Play, Heart, Bookmark, List, Maximize2, X } from 'lucide-react';

export const DetalhesFilme: React.FC<{ onBack: () => void, movieData?: any }> = ({ onBack, movieData }) => {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'dfa86a914be5b8f4bc8d5c2605b8f5ba';

  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [tmdbData, setTmdbData] = useState<any>(null);

  // Busca o trailer, elenco e detalhes extras no TMDB
  useEffect(() => {
    if (movieData?.id) {
      // 1. Busca o Trailer
      fetch(`https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const ptTrailer = data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
            if (ptTrailer) {
              setTrailerKey(ptTrailer.key);
            } else {
              setTrailerKey(data.results[0].key);
            }
          } else {
            fetch(`https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=${TMDB_API_KEY}`)
              .then(res => res.json())
              .then(fallbackData => {
                 if (fallbackData.results && fallbackData.results.length > 0) {
                    const enTrailer = fallbackData.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
                    setTrailerKey(enTrailer ? enTrailer.key : fallbackData.results[0].key);
                 }
              });
          }
        })
        .catch(err => console.error("Erro ao buscar trailer: ", err));

      // 2. Busca o Elenco (Credits)
      fetch(`https://api.themoviedb.org/3/movie/${movieData.id}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`)
        .then(res => res.json())
        .then(data => {
           if (data.cast) {
             setCast(data.cast.slice(0, 5)); // Pega os 5 atores principais
           }
        })
        .catch(err => console.error("Erro ao buscar elenco: ", err));

      // 3. Busca os Detalhes do Filme (Backdrop, Tagline, Rating, Overview)
      fetch(`https://api.themoviedb.org/3/movie/${movieData.id}?api_key=${TMDB_API_KEY}&language=pt-BR`)
        .then(res => res.json())
        .then(data => setTmdbData(data))
        .catch(err => console.error("Erro ao buscar detalhes: ", err));
    }
  }, [movieData?.id, TMDB_API_KEY]);

  // Monta os dados mesclando o Banco de Dados com o TMDB
  const movie = {
    title: tmdbData?.title || movieData?.titulo || 'Carregando...',
    year: movieData?.anoLancamento || (tmdbData?.release_date ? tmdbData.release_date.substring(0, 4) : ''),
    certification: '14',
    releaseDate: tmdbData?.release_date ? tmdbData.release_date.split('-').reverse().join('/') + ' (BR)' : '',
    genres: tmdbData?.genres ? tmdbData.genres.map((g: any) => g.name).join(', ') : (movieData?.genres?.join(', ') || ''),
    duration: tmdbData?.runtime ? `${Math.floor(tmdbData.runtime / 60)}h ${tmdbData.runtime % 60}m` : (movieData?.duration || ''),
    rating: tmdbData?.vote_average ? Math.round(tmdbData.vote_average * 10) : 0,
    tagline: tmdbData?.tagline || '',
    synopsis: tmdbData?.overview || 'Sinopse não disponível em português.',
    posterUrl: movieData?.cover || (tmdbData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : ''), 
    backgroundUrl: tmdbData?.backdrop_path 
       ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}` 
       : 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1920&h=1080'
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack}>&larr; Voltar para o Catálogo</button>
      
      {/* Top secondary nav - similar to TMDB screenshot */}
      <div className={styles.secondaryNav}>
        <ul>
          <li>Visão Geral <span>&#711;</span></li>
          <li>Mídia <span>&#711;</span></li>
          <li>Fã-Clube <span>&#711;</span></li>
          <li>Compartilhar <span>&#711;</span></li>
        </ul>
      </div>

      <div className={styles.heroSection} style={{ backgroundImage: `url(${movie.backgroundUrl})` }}>
        <div className={styles.heroOverlay}>
          <div className={styles.contentWrapper}>
            
            {/* Left Poster */}
            <div className={styles.posterContainer}>
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className={styles.poster} />
              ) : (
                <div className={styles.noPoster}>
                  <Maximize2 className={styles.expandIcon} size={24} />
                  <span>Expandir</span>
                </div>
              )}
            </div>

            {/* Right Info */}
            <div className={styles.infoContainer}>
              <h1 className={styles.title}>
                {movie.title} <span className={styles.year}>({movie.year})</span>
              </h1>
              
              <div className={styles.metadata}>
                <span className={styles.certification}>{movie.certification}</span>
                <span className={styles.releaseDate}>{movie.releaseDate}</span>
                <span className={styles.dot}>•</span>
                <span className={styles.genres}>{movie.genres}</span>
                <span className={styles.dot}>•</span>
                <span className={styles.duration}>{movie.duration}</span>
              </div>

              <div className={styles.actionsRow}>
                <div className={styles.ratingCircle}>
                  <div className={styles.ratingValue}>{movie.rating}<sup>%</sup></div>
                </div>
                <div className={styles.ratingText}>
                  Avaliação<br/>dos<br/>usuários
                </div>
                
                <div className={styles.vibeSection}>
                   <span>Qual é a sua vibe?</span>
                   <div className={styles.vibeEmojis}>😃 😴 😠</div>
                </div>

                <div className={styles.iconButtons}>
                  <button className={styles.iconBtn}><List size={16} /></button>
                  <button className={styles.iconBtn}><Heart size={16} /></button>
                  <button className={styles.iconBtn}><Bookmark size={16} /></button>
                </div>

                <button className={styles.playTrailerBtn} onClick={() => setShowTrailer(true)}>
                  <Play size={20} fill="currentColor" /> Reproduzir trailer
                </button>
              </div>

              <div className={styles.tagline}>{movie.tagline}</div>
              
              <div className={styles.synopsisSection}>
                <h3>Sinopse</h3>
                <p>{movie.synopsis}</p>
              </div>

              <div className={styles.crewSection}>
                {cast.length > 0 ? cast.map((actor, i) => (
                  <div key={i} className={styles.crewMember}>
                    <div className={styles.actorPhotoWrapper}>
                      {actor.profile_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                          alt={actor.name} 
                          className={styles.actorPhoto} 
                        />
                      ) : (
                        <div className={styles.noActorPhoto}>👤</div>
                      )}
                    </div>
                    <h4>{actor.name}</h4>
                    <p>{actor.character}</p>
                  </div>
                )) : (
                  <p style={{ padding: '20px', opacity: 0.7 }}>Carregando elenco...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Space */}
      {showTrailer && (
        <div className={styles.trailerModal} onClick={() => setShowTrailer(false)}>
          <div className={styles.trailerContent} onClick={e => e.stopPropagation()}>
             {trailerKey ? (
               <iframe 
                 width="100%" 
                 height="100%" 
                 src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0`} 
                 title="Trailer do Filme"
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
                 style={{ display: 'block' }}
               ></iframe>
             ) : (
               <div className={styles.trailerPlaceholder}>
                  <p>Nenhum trailer encontrado no TMDB para este filme.</p>
               </div>
             )}
             <button className={styles.closeTrailer} onClick={() => setShowTrailer(false)} title="Fechar Trailer">
                <X size={20} /> Fechar
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
