import React, { useState, useEffect } from 'react';

export const TelaSelecaoCategorias: React.FC<{ userEmail: string, onComplete: () => void }> = ({ userEmail, onComplete }) => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error(err));
  }, []);

  const toggleCategoria = (id: number) => {
    setSelecionadas(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSalvar = async () => {
    try {
      await fetch(`/api/users/${userEmail}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selecionadas)
      });
      onComplete();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar preferências');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#000', color: '#fff', width: '100%' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center', padding: '40px', backgroundColor: '#111', borderRadius: '12px' }}>
        <h1 style={{ color: '#E50914', marginBottom: '10px', lineHeight: '1.1' }}>O que você gosta de assistir?</h1>
        <p style={{ marginBottom: '30px', color: '#aaa', lineHeight: '1.5' }}>Selecione seus gêneros favoritos para que possamos recomendar os melhores filmes para você.</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
          {categorias.map(cat => {
            const isSelected = selecionadas.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategoria(cat.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '30px',
                  border: isSelected ? '2px solid #E50914' : '2px solid #444',
                  backgroundColor: isSelected ? '#E50914' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: '0.2s'
                }}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>

        <button 
          onClick={handleSalvar}
          disabled={selecionadas.length === 0}
          style={{
            padding: '15px 40px',
            borderRadius: '5px',
            backgroundColor: selecionadas.length > 0 ? '#E50914' : '#555',
            color: '#fff',
            border: 'none',
            fontSize: '18px',
            cursor: selecionadas.length > 0 ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          Começar a Assistir
        </button>
      </div>
    </div>
  );
};
