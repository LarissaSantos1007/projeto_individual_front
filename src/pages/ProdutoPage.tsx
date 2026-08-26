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

// PRODUTOS PRÉ-CADASTRADOS
const PRODUTOS_INICIAIS: Produto[] = [
  {
    id_produto: 1,
    codigo: 'PROD-001',
    nome: 'Notebook Dell Inspiron',
    descricao: 'Notebook 15.6 polegadas, 8GB RAM, 256GB SSD',
    id_categoria: 1,
    preco_unitario: 3499.90,
    quantidade_disponivel: 15,
    quantidade_minima: 5,
    status: 'ATIVO'
  },
  {
    id_produto: 2,
    codigo: 'PROD-002',
    nome: 'Smartphone Samsung Galaxy',
    descricao: 'Smartphone 6.5 polegadas, 128GB, 5G',
    id_categoria: 1,
    preco_unitario: 2499.00,
    quantidade_disponivel: 8,
    quantidade_minima: 3,
    status: 'ATIVO'
  },
  {
    id_produto: 3,
    codigo: 'PROD-003',
    nome: 'Camiseta Polo',
    descricao: 'Camiseta polo masculina, algodão 100%, tamanho G',
    id_categoria: 2,
    preco_unitario: 89.90,
    quantidade_disponivel: 50,
    quantidade_minima: 10,
    status: 'ATIVO'
  },
  {
    id_produto: 4,
    codigo: 'PROD-004',
    nome: 'Livro O Hobbit',
    descricao: 'Edição ilustrada, 320 páginas, capa dura',
    id_categoria: 3,
    preco_unitario: 79.90,
    quantidade_disponivel: 2,
    quantidade_minima: 5,
    status: 'INATIVO'
  },
  {
    id_produto: 5,
    codigo: 'PROD-005',
    nome: 'Fone de Ouvido Bluetooth',
    descricao: 'Fone sem fio, cancelamento de ruído, bateria 20h',
    id_categoria: 1,
    preco_unitario: 199.90,
    quantidade_disponivel: 25,
    quantidade_minima: 8,
    status: 'ATIVO'
  }
];

const CATEGORIAS_INICIAIS: Categoria[] = [
  { id_categoria: 1, nome: 'Eletrônicos' },
  { id_categoria: 2, nome: 'Roupas' },
  { id_categoria: 3, nome: 'Livros' },
];

const ProdutoPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_INICIAIS);
  const [loading, setLoading] = useState(false);
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

  // Tenta carregar do backend, se falhar usa os dados iniciais
  const loadData = async () => {
    setLoading(true);
    try {
      const [produtosRes, categoriasRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
      ]);
      if (produtosRes.data && produtosRes.data.length > 0) {
        setProdutos(produtosRes.data);
      }
      if (categoriasRes.data && categoriasRes.data.length > 0) {
        setCategorias(categoriasRes.data);
      }
    } catch (error) {
      console.log('Usando dados locais (backend não disponível)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/produtos/${editing.id_produto}`, formData);
        alert('Produto atualizado com sucesso!');
      } else {
        await api.post('/produtos', formData);
        alert('Produto criado com sucesso!');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ 
        codigo: '', 
        nome: '', 
        descricao: '', 
        id_categoria: 0, 
        preco_unitario: 0, 
        quantidade_disponivel: 0, 
        quantidade_minima: 0, 
        status: 'ATIVO' 
      });
      await loadData();
    } catch (error) {
      // Se falhar, salva localmente
      if (editing) {
        setProdutos(produtos.map(p => p.id_produto === editing.id_produto ? { ...formData, id_produto: editing.id_produto } : p));
        alert('Produto atualizado localmente!');
      } else {
        const novo = { ...formData, id_produto: Date.now() };
        setProdutos([...produtos, novo]);
        alert('Produto criado localmente!');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ 
        codigo: '', 
        nome: '', 
        descricao: '', 
        id_categoria: 0, 
        preco_unitario: 0, 
        quantidade_disponivel: 0, 
        quantidade_minima: 0, 
        status: 'ATIVO' 
      });
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
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/produtos/${id}`);
        alert('Produto excluído com sucesso!');
        await loadData();
      } catch (error) {
        // Se falhar, exclui localmente
        setProdutos(produtos.filter(p => p.id_produto !== id));
        alert('Produto excluído localmente!');
      }
    }
  };

  const getCategoriaNome = (id: number) => {
    const categoria = categorias.find(c => c.id_categoria === id);
    return categoria ? categoria.nome : 'N/A';
  };

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Produtos</h1>
        <button 
          style={styles.btnPrimary} 
          onClick={() => { 
            setShowForm(true); 
            setEditing(null); 
            setFormData({ 
              codigo: '', 
              nome: '', 
              descricao: '', 
              id_categoria: 0, 
              preco_unitario: 0, 
              quantidade_disponivel: 0, 
              quantidade_minima: 0, 
              status: 'ATIVO' 
            }); 
          }}
        >
          ➕ Novo Produto
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2>{editing ? '✏️ Editar Produto' : '📝 Novo Produto'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formRow2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Código *</label>
                <input 
                  required 
                  value={formData.codigo} 
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})} 
                  style={styles.input} 
                  placeholder="Código do produto" 
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome *</label>
                <input 
                  required 
                  value={formData.nome} 
                  onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                  style={styles.input} 
                  placeholder="Nome do produto" 
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <textarea 
                value={formData.descricao} 
                onChange={(e) => setFormData({...formData, descricao: e.target.value})} 
                style={styles.textarea} 
                placeholder="Descrição do produto" 
                rows={2} 
              />
            </div>

            <div style={styles.formRow2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Categoria *</label>
                <select 
                  required 
                  value={formData.id_categoria} 
                  onChange={(e) => setFormData({...formData, id_categoria: parseInt(e.target.value)})} 
                  style={styles.select}
                >
                  <option value={0}>Selecione...</option>
                  {categorias.map(c => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'ATIVO' | 'INATIVO'})} 
                  style={styles.select}
                >
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>
            </div>

            <div style={styles.formRow2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preço Unitário (R$) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={formData.preco_unitario} 
                  onChange={(e) => setFormData({...formData, preco_unitario: parseFloat(e.target.value) || 0})} 
                  style={styles.input} 
                  placeholder="0,00" 
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Quantidade Disponível *</label>
                <input 
                  type="number" 
                  required 
                  value={formData.quantidade_disponivel} 
                  onChange={(e) => setFormData({...formData, quantidade_disponivel: parseInt(e.target.value) || 0})} 
                  style={styles.input} 
                  placeholder="0" 
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantidade Mínima *</label>
              <input 
                type="number" 
                required 
                value={formData.quantidade_minima} 
                onChange={(e) => setFormData({...formData, quantidade_minima: parseInt(e.target.value) || 0})} 
                style={styles.input} 
                placeholder="0" 
              />
            </div>

            <div style={styles.formActions}>
              <button 
                type="button" 
                style={styles.btnSecondary} 
                onClick={() => { setShowForm(false); setEditing(null); }}
              >
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
        <div style={styles.listHeader}>
          <h2 style={styles.listTitle}>📋 Lista de Produtos</h2>
          <span style={styles.listCount}>{produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}</span>
        </div>

        {produtos.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhum produto cadastrado.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {produtos.map((produto) => (
              <div 
                key={produto.id_produto} 
                style={{
                  ...styles.card, 
                  opacity: produto.status === 'ATIVO' ? 1 : 0.6
                }}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{produto.nome}</h3>
                    <span style={styles.cardCode}>#{produto.codigo}</span>
                  </div>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: produto.status === 'ATIVO' ? '#d4edda' : '#f8d7da',
                    color: produto.status === 'ATIVO' ? '#155724' : '#721c24'
                  }}>
                    {produto.status}
                  </span>
                </div>
                <p style={styles.cardDesc}>{produto.descricao || 'Sem descrição'}</p>
                <div style={styles.cardDetails}>
                  <div><strong>Categoria:</strong> {getCategoriaNome(produto.id_categoria)}</div>
                  <div><strong>Preço:</strong> R$ {produto.preco_unitario.toFixed(2)}</div>
                  <div><strong>Estoque:</strong> {produto.quantidade_disponivel}</div>
                  <div><strong>Mínimo:</strong> {produto.quantidade_minima}</div>
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.btnEdit} onClick={() => handleEdit(produto)}>✏️ Editar</button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(produto.id_produto!)}>🗑️ Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  loading: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#666',
  },
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
    flex: 1,
    padding: '0.4rem 0.8rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnDelete: {
    flex: 1,
    padding: '0.4rem 0.8rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
  formRow2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
  select: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
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
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  listTitle: {
    fontSize: '1.2rem',
    color: '#333',
    margin: 0,
  },
  listCount: {
    fontSize: '0.9rem',
    color: '#888',
    backgroundColor: '#e8ecf1',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e8ecf1',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  cardCode: {
    fontSize: '0.8rem',
    color: '#999',
    fontWeight: 500,
  },
  cardDesc: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  cardDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.25rem 0.5rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  badge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#999',
  },
};

export default ProdutoPage;