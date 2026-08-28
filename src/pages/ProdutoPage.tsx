import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

interface Produto {
  id_produto?: number;
  codigo: string;
  nome: string;
  descricao?: string;
  id_categoria: number;
  preco_unitario: number;
  quantidade_disponivel: number;
  quantidade_minima: number;
  status: 'ATIVO' | 'INATIVO';
}

interface Categoria {
  id_categoria: number;
  nome: string;
}

const ProdutoPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    id_categoria: 0,
    preco_unitario: 0,
    quantidade_disponivel: 0,
    quantidade_minima: 0,
    status: 'ATIVO' as 'ATIVO' | 'INATIVO',
  });

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
      ]);
      setProdutos(prodRes.data || []);
      setCategorias(catRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo.trim() || !formData.nome.trim() || formData.id_categoria === 0 || formData.preco_unitario <= 0) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    try {
      if (editing) {
        await api.put(`/produtos/${editing.id_produto}`, formData);
        alert('Produto atualizado!');
      } else {
        await api.post('/produtos', formData);
        alert('Produto criado!');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' });
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao salvar produto');
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditing(produto);
    setFormData({
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao || '',
      id_categoria: produto.id_categoria,
      preco_unitario: produto.preco_unitario,
      quantidade_disponivel: produto.quantidade_disponivel,
      quantidade_minima: produto.quantidade_minima,
      status: produto.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza?')) {
      try {
        await api.delete(`/produtos/${id}`);
        alert('Produto excluído!');
        await loadData();
      } catch (error) {
        alert('Erro ao excluir produto');
      }
    }
  };

  const getCategoriaNome = (id: number) => {
    const cat = categorias.find(c => c.id_categoria === id);
    return cat ? cat.nome : 'N/A';
  };

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Produtos</h1>
        <button style={styles.btnPrimary} onClick={() => { setShowForm(true); setEditing(null); setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' }); }}>
          ➕ Novo Produto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{editing ? '✏️ Editar' : '📝 Novo'} Produto</h2>
          <input required placeholder="Código" value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} style={styles.input} />
          <input required placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} style={styles.input} />
          <input placeholder="Descrição" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} style={styles.input} />
          <select required value={formData.id_categoria} onChange={(e) => setFormData({ ...formData, id_categoria: parseInt(e.target.value) })} style={styles.select}>
            <option value={0}>Selecione uma categoria...</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>{c.nome}</option>
            ))}
          </select>
          <input type="number" step="0.01" required placeholder="Preço" value={formData.preco_unitario || ''} onChange={(e) => setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) || 0 })} style={styles.input} />
          <input type="number" required placeholder="Quantidade Disponível" value={formData.quantidade_disponivel || ''} onChange={(e) => setFormData({ ...formData, quantidade_disponivel: parseInt(e.target.value) || 0 })} style={styles.input} />
          <input type="number" required placeholder="Quantidade Mínima" value={formData.quantidade_minima || ''} onChange={(e) => setFormData({ ...formData, quantidade_minima: parseInt(e.target.value) || 0 })} style={styles.input} />
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ATIVO' | 'INATIVO' })} style={styles.select}>
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
          <div style={styles.formActions}>
            <button type="button" style={styles.btnSecondary} onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</button>
            <button type="submit" style={styles.btnPrimary}>{editing ? 'Atualizar' : 'Cadastrar'}</button>
          </div>
        </form>
      )}

      <div style={styles.grid}>
        {produtos.map((p) => (
          <div key={p.id_produto} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>{p.nome}</h3>
              <div>
                <button style={styles.btnEdit} onClick={() => handleEdit(p)}>✏️</button>
                <button style={styles.btnDelete} onClick={() => handleDelete(p.id_produto!)}>🗑️</button>
              </div>
            </div>
            <p style={styles.cardDesc}>#{p.codigo}</p>
            <p style={styles.cardDesc}>{p.descricao || 'Sem descrição'}</p>
            <div style={styles.cardDetails}>
              <div><strong>Categoria:</strong> {getCategoriaNome(p.id_categoria)}</div>
              <div><strong>Preço:</strong> R$ {p.preco_unitario.toFixed(2)}</div>
              <div><strong>Estoque:</strong> {p.quantidade_disponivel}</div>
              <div><strong>Mínimo:</strong> {p.quantidade_minima}</div>
              <div><strong>Status:</strong> {p.status}</div>
            </div>
          </div>
        ))}
      </div>
      {produtos.length === 0 && <p style={styles.empty}>Nenhum produto cadastrado.</p>}
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
  select: { width: '100%', padding: '0.7rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none', backgroundColor: '#fff' },
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  card: { backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e8ecf1' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardDesc: { color: '#666', fontSize: '0.9rem', margin: '0.25rem 0' },
  cardDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.5rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem', margin: '0.5rem 0' },
  empty: { textAlign: 'center' as const, padding: '2rem', color: '#999' },
};

export default ProdutoPage;