import React, { useState, useEffect } from 'react';

export const TelaPainelAdmin: React.FC<{ userEmail: string, onLogout: () => void }> = ({ userEmail, onLogout }) => {
  const [filmes, setFilmes] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [duracao, setDuracao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  const carregarDados = async () => {
    try {
      const resCat = await fetch('/api/categorias');
      const cats = await resCat.json();
      setCategorias(cats);

      // Usar a rota de recomendados com base nas categorias escolhidas no onboarding
      const resFilmes = await fetch(`/api/filmes/recomendados/${userEmail}`);
      const filmesData = await resFilmes.json();
      setFilmes(filmesData);
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastrarFilme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          anoLancamento: parseInt(ano),
          duracaoMinutos: parseInt(duracao),
          categoria: { id: parseInt(categoriaId) }
        })
      });

      if (response.ok) {
        alert('Filme cadastrado com sucesso!');
        setTitulo(''); setAno(''); setDuracao(''); setCategoriaId('');
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
        await fetch(`/api/filmes/${id}`, { method: 'DELETE' });
        carregarDados();
      } catch (error) {
        alert('Erro ao excluir filme.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#111', minHeight: '100vh', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Painel de Gerenciamento - Filmes</h1>
        <button onClick={onLogout} style={{ padding: '10px', cursor: 'pointer', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>Sair</button>
      </header>

      <section style={{ marginTop: '20px', backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
        <h2>Cadastrar Filme</h2>
        <form onSubmit={handleCadastrarFilme} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          <input type="number" placeholder="Ano de Lançamento" value={ano} onChange={e => setAno(e.target.value)} required />
          <input type="number" placeholder="Duração (min)" value={duracao} onChange={e => setDuracao(e.target.value)} required />
          <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
            <option value="">Selecione a Categoria</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Salvar</button>
        </form>
      </section>

      <section style={{ marginTop: '20px' }}>
        <h2>Lista de Filmes</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #555', textAlign: 'left' }}>
              <th>ID</th>
              <th>Título</th>
              <th>Ano</th>
              <th>Duração</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filmes.map(f => (
              <tr key={f.id} style={{ borderBottom: '1px solid #444' }}>
                <td>{f.id}</td>
                <td>{f.titulo}</td>
                <td>{f.anoLancamento}</td>
                <td>{f.duracaoMinutos} min</td>
                <td>{f.categoria?.nome}</td>
                <td>
                  <button onClick={() => handleDeletar(f.id)} style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>Excluir</button>
                </td>
              </tr>
            ))}
            {filmes.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Nenhum filme cadastrado.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
};
