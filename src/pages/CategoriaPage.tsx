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

  const loadData = async () => {
    try {
      const res = await api.get('/categorias');
      setCategorias(res.data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      alert('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      alert('Nome é obrigatório!');
      return;
    }
    try {
      if (editing) {
        await api.put(`/categorias/${editing.id_categoria}`, formData);
        alert('Categoria atualizada!');
      } else {
        await api.post('/categorias', formData);
        alert('Categoria criada!');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ nome: '', descricao: '' });
      await loadData();
    } catch (error) {
      alert('Erro ao salvar categoria');
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditing(categoria);
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza?')) {
      try {
        await api.delete(`/categorias/${id}`);
        alert('Categoria excluída!');
        await loadData();
      } catch (error) {
        alert('Erro ao excluir categoria');
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
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{editing ? '✏️ Editar' : '📝 Nova'} Categoria</h2>
          <input
            required
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            style={styles.input}
          />
          <div style={styles.formActions}>
            <button type="button" style={styles.btnSecondary} onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</button>
            <button type="submit" style={styles.btnPrimary}>{editing ? 'Atualizar' : 'Cadastrar'}</button>
          </div>
        </form>
      )}

      <div style={styles.grid}>
        {categorias.map((cat) => (
          <div key={cat.id_categoria} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>{cat.nome}</h3>
              <div>
                <button style={styles.btnEdit} onClick={() => handleEdit(cat)}>✏️</button>
                <button style={styles.btnDelete} onClick={() => handleDelete(cat.id_categoria!)}>🗑️</button>
              </div>
            </div>
            <p style={styles.cardDesc}>{cat.descricao || 'Sem descrição'}</p>
          </div>
        ))}
      </div>
      {categorias.length === 0 && <p style={styles.empty}>Nenhuma categoria cadastrada.</p>}
    </div>
  );
};

const styles = {
  loading: { textAlign: 'center' as const, padding: '3rem', color: '#666' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '0.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#333', margin: 0 },
  btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  btnSecondary: { padding: '0.6rem 1.5rem', backgroundColor: '#e0e0e0', color: '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  btnEdit: { padding: '0.25rem 0.6rem', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem' },
  btnDelete: { padding: '0.25rem 0.6rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  input: { width: '100%', padding: '0.7rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none' },
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' },
  card: { backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e8ecf1' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardDesc: { color: '#666', fontSize: '0.9rem', margin: '0.5rem 0 0' },
  empty: { textAlign: 'center' as const, padding: '2rem', color: '#999' },
};

export default CategoriaPage;