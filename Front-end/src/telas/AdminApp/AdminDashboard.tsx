import React, { useState, useEffect } from 'react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [filmes, setFilmes] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  
  // Estados do formulário
  const [tmdbId, setTmdbId] = useState<number | ''>('');
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [duracao, setDuracao] = useState('');
  const [capa, setCapa] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  // Estados de busca TMDB
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'dfa86a914be5b8f4bc8d5c2605b8f5ba'; 

  const carregarDados = async () => {
    try {
      const resCat = await fetch('/api/categorias');
      if (resCat.ok) {
        const cats = await resCat.json();
        setCategorias(cats);
      }

      const resFilmes = await fetch('/api/filmes');
      if (resFilmes.ok) {
        const filmesData = await resFilmes.json();
        setFilmes(filmesData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSearchTMDB = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=pt-BR`);
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Erro ao buscar no TMDB:', error);
      alert('Falha ao buscar no TMDB. Verifique a API Key.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = async (movie: any) => {
    setTmdbId(movie.id);
    setTitulo(movie.title);
    
    if (movie.release_date) {
      setAno(movie.release_date.substring(0, 4));
    } else {
      setAno('');
    }

    if (movie.poster_path) {
      setCapa(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    } else {
      setCapa('');
    }

    setSearchResults([]);
    setSearchQuery('');

    // Fetch runtime (duração)
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
      const details = await res.json();
      if (details.runtime) {
        setDuracao(details.runtime.toString());
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme (runtime):', error);
    }
  };

  const handleCadastrarFilme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmdbId) {
      alert('Por favor, selecione um filme do TMDB primeiro ou preencha o ID.');
      return;
    }

    try {
      // POST para http://localhost:8080/api/filmes conforme instrução
      const response = await fetch('http://localhost:8080/api/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tmdbId,
          tmdbId: tmdbId,
          titulo,
          anoLancamento: parseInt(ano),
          capa,
          categoria: { id: parseInt(categoriaId) },
          duracaoMinutos: parseInt(duracao)
        })
      });

      if (response.ok) {
        alert('Filme cadastrado com sucesso!');
        setTmdbId(''); setTitulo(''); setAno(''); setDuracao(''); setCapa(''); setCategoriaId('');
        carregarDados();
      } else {
        const errorMsg = await response.text();
        alert(`Erro: ${errorMsg}`);
      }
    } catch (error) {
      alert('Erro ao cadastrar filme.');
    }
  };

  const handleDeletar = async (id: number) => {
    if (window.confirm('Deseja realmente excluir este filme?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/filmes/${id}`, { method: 'DELETE' });
        if (response.ok) {
          carregarDados();
        } else {
          const errorMsg = await response.text();
          alert(`Falha ao excluir filme: ${errorMsg}`);
        }
      } catch (error) {
        alert('Erro ao excluir filme.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#16171d', color: '#f3f4f6', fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif" }}>
      
      <aside style={{ width: '250px', backgroundColor: '#1f2028', borderRight: '1px solid #2e303a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 30px 0', color: '#c084fc' }}>AFK Admin</h2>
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#f3f4f6', textDecoration: 'none', display: 'block', padding: '10px', backgroundColor: 'rgba(192, 132, 252, 0.15)', borderRadius: '6px' }}>
                Gerenciar Filmes
              </a>
            </li>
          </ul>
        </nav>
        <button 
          onClick={onLogout} 
          style={{ padding: '10px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sair do Painel
        </button>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px' }}>Dashboard de Filmes</h1>
            <p style={{ color: '#9ca3af', margin: '5px 0 0 0' }}>Cadastre e gerencie o catálogo de filmes da plataforma.</p>
          </div>
          <button 
            onClick={async () => {
              try {
                await fetch('/api/sync/tmdb', { method: 'POST' });
                alert('Sincronização com TMDB iniciada! Verifique o console do Java. Atualize a página em alguns segundos.');
              } catch (e) {
                alert('Erro ao iniciar sincronização.');
              }
            }}
            style={{ padding: '12px 24px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔥 Puxar Filmes Populares do TMDB
          </button>
        </header>

        <section style={{ backgroundColor: '#1f2028', padding: '24px', borderRadius: '8px', marginBottom: '30px', boxShadow: 'rgba(0, 0, 0, 0.2) 0 4px 6px -2px' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', marginBottom: '20px', color: '#c084fc' }}>Buscar no TMDB</h2>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Digite o nome do filme..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearchTMDB()}
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #2e303a', backgroundColor: '#16171d', color: '#f3f4f6' }} 
            />
            <button 
              onClick={handleSearchTMDB}
              disabled={isSearching}
              style={{ padding: '10px 20px', backgroundColor: '#c084fc', color: '#16171d', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div style={{ backgroundColor: '#16171d', borderRadius: '4px', border: '1px solid #2e303a', maxHeight: '200px', overflowY: 'auto', padding: '10px', marginBottom: '20px' }}>
              {searchResults.map(movie => (
                <div 
                  key={movie.id} 
                  onClick={() => handleSelectMovie(movie)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', borderBottom: '1px solid #2e303a', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(192, 132, 252, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} style={{ width: '46px', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '46px', height: '69px', backgroundColor: '#2e303a', borderRadius: '4px' }}></div>
                  )}
                  <div>
                    <strong style={{ display: 'block' }}>{movie.title}</strong>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{movie.release_date ? movie.release_date.substring(0, 4) : 'N/D'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr style={{ borderColor: '#2e303a', margin: '30px 0' }} />

          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Dados do Filme</h2>
          <form onSubmit={handleCadastrarFilme} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 100px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#9ca3af' }}>TMDB ID</label>
              <input type="number" value={tmdbId} onChange={e => setTmdbId(e.target.value === '' ? '' : Number(e.target.value))} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #2e303a', backgroundColor: '#16171d', color: '#f3f4f6', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#9ca3af' }}>Título</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #2e303a', backgroundColor: '#16171d', color: '#f3f4f6', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 100px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#9ca3af' }}>Ano</label>
              <input type="number" value={ano} onChange={e => setAno(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #2e303a', backgroundColor: '#16171d', color: '#f3f4f6', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 100px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#9ca3af' }}>Duração (min)</label>
              <input type="number" value={duracao} onChange={e => setDuracao(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #2e303a', backgroundColor: '#16171d', color: '#f3f4f6', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#9ca3af' }}>Capa (URL)</label>
              <input type="text" value={capa} onChange={e => setCapa(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #2e303a', backgroundColor: '#16171d', color: '#f3f4f6', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#9ca3af' }}>Categoria</label>
              <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #2e303a', backgroundColor: '#16171d', color: '#f3f4f6', boxSizing: 'border-box' }}>
                <option value="">Selecione...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', height: '40px', marginTop: '10px' }}>Salvar Filme</button>
          </form>
        </section>

        <section style={{ backgroundColor: '#1f2028', padding: '24px', borderRadius: '8px', boxShadow: 'rgba(0, 0, 0, 0.2) 0 4px 6px -2px' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', marginBottom: '20px' }}>Lista de Filmes</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #2e303a', color: '#9ca3af' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Título</th>
                  <th style={{ padding: '12px' }}>Ano</th>
                  <th style={{ padding: '12px' }}>Duração</th>
                  <th style={{ padding: '12px' }}>Categoria</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filmes.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #2e303a' }}>
                    <td style={{ padding: '12px' }}>{f.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{f.titulo}</td>
                    <td style={{ padding: '12px' }}>{f.anoLancamento}</td>
                    <td style={{ padding: '12px' }}>{f.duracaoMinutos}m</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                        {f.categoria?.nome || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleDeletar(f.id)} style={{ padding: '6px 12px', backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4d', border: '1px solid rgba(255, 0, 0, 0.3)', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}>Excluir</button>
                    </td>
                  </tr>
                ))}
                {filmes.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>Nenhum filme cadastrado no catálogo.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
