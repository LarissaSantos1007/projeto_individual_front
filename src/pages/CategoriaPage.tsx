import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

interface Categoria {
  id_categoria?: number;
  nome: string;
  descricao?: string;
}

const CategoriaPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });

  const loadCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categorias/${editing.id_categoria}`, formData);
        alert('Categoria atualizada com sucesso!');
      } else {
        await api.post('/categorias', formData);
        alert('Categoria criada com sucesso!');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ nome: '', descricao: '' });
      await loadCategorias();
    } catch (error) {
      alert('Erro ao salvar categoria');
      console.error(error);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditing(categoria);
    setFormData({ nome: categoria.nome, descricao: categoria.descricao || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`/categorias/${id}`);
        alert('Categoria excluída com sucesso!');
        await loadCategorias();
      } catch (error) {
        alert('Erro ao excluir categoria');
        console.error(error);
      }
    }
  };

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>📂 Categorias</h1>
        <button style={styles.btnPrimary} onClick={() => { setShowForm(true); setEditing(null); setFormData({ nome: '', descricao: '' }); }}>
          ➕ Nova Categoria
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2>{editing ? '✏️ Editar Categoria' : '📝 Nova Categoria'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome *</label>
              <input
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                style={styles.input}
                placeholder="Digite o nome da categoria"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                style={styles.textarea}
                placeholder="Digite a descrição"
                rows={3}
              />
            </div>
            <div style={styles.formActions}>
              <button type="button" style={styles.btnSecondary} onClick={() => { setShowForm(false); setEditing(null); }}>
                Cancelar
              </button>
              <button type="submit" style={styles.btnSubmit}>
                {editing ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.listContainer}>
        {categorias.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma categoria cadastrada.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {categorias.map((categoria) => (
              <div key={categoria.id_categoria} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{categoria.nome}</h3>
                  <div style={styles.cardActions}>
                    <button style={styles.btnEdit} onClick={() => handleEdit(categoria)}>✏️</button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(categoria.id_categoria!)}>🗑️</button>
                  </div>
                </div>
                {categoria.descricao && <p style={styles.cardDesc}>{categoria.descricao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#333',
    margin: 0,
  },
  btnPrimary: {
    padding: '0.6rem 1.5rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  btnSubmit: {
    padding: '0.6rem 1.5rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  btnSecondary: {
    padding: '0.6rem 1.5rem',
    backgroundColor: '#e0e0e0',
    color: '#555',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  btnEdit: {
    padding: '0.25rem 0.6rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnDelete: {
    padding: '0.25rem 0.6rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.25rem',
    fontWeight: 600,
    color: '#555',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  formActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  listContainer: {
    marginTop: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e8ecf1',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  cardDesc: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0 0',
  },
  cardActions: {
    display: 'flex',
    gap: '0.25rem',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#999',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#666',
  },
};

export default CategoriaPage;