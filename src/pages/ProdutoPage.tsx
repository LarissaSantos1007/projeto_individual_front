import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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

const PRODUTOS_EXEMPLO: Produto[] = [
  { id_produto: 1, codigo: 'PROD-001', nome: 'Notebook Dell Inspiron', descricao: '15.6 polegadas, 8GB RAM, 256GB SSD, Intel i5', id_categoria: 1, preco_unitario: 3499.90, quantidade_disponivel: 15, quantidade_minima: 5, status: 'ATIVO' },
  { id_produto: 2, codigo: 'PROD-002', nome: 'Smartphone Samsung Galaxy S23', descricao: '6.5 polegadas, 128GB, 5G, tela AMOLED', id_categoria: 22, preco_unitario: 2499.00, quantidade_disponivel: 8, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 3, codigo: 'PROD-003', nome: 'Monitor LG 24"', descricao: '24 polegadas, Full HD, 75Hz, HDMI, DisplayPort', id_categoria: 11, preco_unitario: 899.90, quantidade_disponivel: 3, quantidade_minima: 6, status: 'ATIVO' },
  { id_produto: 4, codigo: 'PROD-004', nome: 'Teclado Mecânico Redragon', descricao: 'Switches blue, RGB, ABNT2, 60%', id_categoria: 4, preco_unitario: 299.90, quantidade_disponivel: 12, quantidade_minima: 4, status: 'ATIVO' },
  { id_produto: 5, codigo: 'PROD-005', nome: 'Mouse Gamer Logitech', descricao: '1600 DPI, 7 botões programáveis, RGB, wireless', id_categoria: 4, preco_unitario: 149.90, quantidade_disponivel: 1, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 6, codigo: 'PROD-006', nome: 'Placa Mãe ASUS ROG', descricao: 'Socket LGA1200, DDR4, HDMI, PCIe 4.0', id_categoria: 8, preco_unitario: 799.90, quantidade_disponivel: 0, quantidade_minima: 2, status: 'ATIVO' },
  { id_produto: 7, codigo: 'PROD-007', nome: 'Fonte Corsair 500W', descricao: 'Fonte ATX, 80 Plus Bronze, modular', id_categoria: 9, preco_unitario: 349.90, quantidade_disponivel: 0, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 8, codigo: 'PROD-008', nome: 'SSD Kingston 480GB', descricao: 'SSD SATA III, leitura 500MB/s, 2.5 polegadas', id_categoria: 5, preco_unitario: 279.90, quantidade_disponivel: 4, quantidade_minima: 4, status: 'ATIVO' },
  { id_produto: 9, codigo: 'PROD-009', nome: 'Memória RAM HyperX 16GB', descricao: 'DDR4, 3200MHz, RGB, 2x8GB', id_categoria: 7, preco_unitario: 399.90, quantidade_disponivel: 2, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 10, codigo: 'PROD-010', nome: 'Headset Gamer HyperX', descricao: 'Som surround 7.1, microfone removível, USB', id_categoria: 15, preco_unitario: 459.90, quantidade_disponivel: 0, quantidade_minima: 2, status: 'ATIVO' },
  { id_produto: 11, codigo: 'PROD-011', nome: 'Roteador TP-Link AC1200', descricao: 'Wi-Fi Dual Band, 4 antenas, porta Gigabit', id_categoria: 17, preco_unitario: 199.90, quantidade_disponivel: 6, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 12, codigo: 'PROD-012', nome: 'Placa de Vídeo NVIDIA RTX 3060', descricao: '12GB GDDR6, Ray Tracing, DLSS', id_categoria: 26, preco_unitario: 2499.90, quantidade_disponivel: 0, quantidade_minima: 2, status: 'ATIVO' },
];

const CATEGORIAS_EXEMPLO: Categoria[] = [
  { id_categoria: 1, nome: 'Hardware' },
  { id_categoria: 4, nome: 'Periféricos' },
  { id_categoria: 5, nome: 'Armazenamento' },
  { id_categoria: 7, nome: 'Memórias' },
  { id_categoria: 8, nome: 'Placas Mãe' },
  { id_categoria: 9, nome: 'Fontes de Alimentação' },
  { id_categoria: 11, nome: 'Monitores' },
  { id_categoria: 15, nome: 'Headphones' },
  { id_categoria: 17, nome: 'Roteadores' },
  { id_categoria: 22, nome: 'Smartphones' },
  { id_categoria: 26, nome: 'Placas de Vídeo' },
];

const ProdutoPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_EXEMPLO);
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_EXEMPLO);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (prodRes.data && prodRes.data.length > 0) {
        setProdutos(prodRes.data);
      }
      if (catRes.data && catRes.data.length > 0) {
        setCategorias(catRes.data);
      }
    } catch (error) {
      console.log('Usando dados locais');
    }
  };

  useEffect(() => {
    setTimeout(loadData, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo.trim() || !formData.nome.trim() || formData.id_categoria === 0 || formData.preco_unitario <= 0) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    setIsSubmitting(true);

    if (editing) {
      const produtoAtualizado = { ...formData, id_produto: editing.id_produto };
      setProdutos(produtos.map(p => p.id_produto === editing.id_produto ? produtoAtualizado : p));
      toast.success('Produto atualizado! ✅');
      
      try {
        await api.put(`/produtos/${editing.id_produto}`, formData);
        await loadData();
      } catch (error) {
        console.log('Não sincronizado');
      }
    } else {
      const novoProduto = { ...formData, id_produto: Date.now() };
      setProdutos([...produtos, novoProduto]);
      toast.success('Produto criado! ✅');
      
      try {
        await api.post('/produtos', formData);
        await loadData();
      } catch (error) {
        console.log('Não sincronizado');
      }
    }
    
    setShowForm(false);
    setEditing(null);
    setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' });
    setIsSubmitting(false);
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
      setProdutos(produtos.filter(p => p.id_produto !== id));
      toast.success('Produto excluído! 🗑️');
      try {
        await api.delete(`/produtos/${id}`);
        await loadData();
      } catch (error) {
        console.log('Não sincronizado');
      }
    }
  };

  const getCategoriaNome = (id: number) => {
    const cat = categorias.find(c => c.id_categoria === id);
    return cat ? cat.nome : 'N/A';
  };

  const filteredProdutos = produtos.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'TODOS' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Produtos</h1>
        <button style={styles.btnPrimary} onClick={() => { setShowForm(true); setEditing(null); setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' }); }}>
          ➕ Novo Produto
        </button>
      </div>

      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="🔍 Buscar produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterSelect}>
          <option value="TODOS">Todos</option>
          <option value="ATIVO">✅ Ativos</option>
          <option value="INATIVO">⛔ Inativos</option>
        </select>
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
            <button type="submit" style={styles.btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (editing ? 'Atualizar' : 'Cadastrar')}
            </button>
          </div>
        </form>
      )}

      <div style={styles.gridProdutos}>
        {filteredProdutos.map((p) => (
          <div key={p.id_produto} style={styles.cardProduto}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{p.nome}</h3>
              <div>
                <button style={styles.btnEdit} onClick={() => handleEdit(p)}>✏️</button>
                <button style={styles.btnDelete} onClick={() => handleDelete(p.id_produto!)}>🗑️</button>
              </div>
            </div>
            <span style={styles.cardCode}>#{p.codigo}</span>
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
      {filteredProdutos.length === 0 && <p style={styles.empty}>Nenhum produto encontrado.</p>}
    </div>
  );
};

const styles = {
  loading: { textAlign: 'center' as const, padding: '3rem', color: '#a29bfe' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '0.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#fd79a8', margin: 0 },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const },
  searchInput: { flex: 1, padding: '0.7rem 1rem', border: '1px solid rgba(253,121,168,0.2)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', minWidth: '200px', background: '#1a1730', color: '#d0d0e0' },
  filterSelect: { padding: '0.7rem 1rem', border: '1px solid rgba(253,121,168,0.2)', borderRadius: '10px', fontSize: '0.95rem', background: '#1a1730', color: '#d0d0e0', outline: 'none', cursor: 'pointer' },
  btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  btnSecondary: { padding: '0.6rem 1.5rem', backgroundColor: '#2d1b69', color: '#fd79a8', border: '1px solid rgba(253,121,168,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  btnEdit: { padding: '0.25rem 0.6rem', backgroundColor: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem' },
  btnDelete: { padding: '0.25rem 0.6rem', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { background: '#1a1730', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(253,121,168,0.1)' },
  input: { width: '100%', padding: '0.7rem', border: '1px solid rgba(253,121,168,0.2)', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  select: { width: '100%', padding: '0.7rem', border: '1px solid rgba(253,121,168,0.2)', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  gridProdutos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
  cardProduto: { background: '#1a1730', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(253,121,168,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 600, color: '#d0d0e0', margin: 0 },
  cardCode: { fontSize: '0.8rem', color: '#666680' },
  cardDesc: { color: '#8888a0', fontSize: '0.9rem', margin: '0.25rem 0' },
  cardDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.5rem', padding: '0.75rem', background: '#120f20', borderRadius: '8px', border: '1px solid rgba(253,121,168,0.05)', fontSize: '0.9rem', margin: '0.5rem 0', color: '#b0b0c8' },
  empty: { textAlign: 'center' as const, padding: '2rem', color: '#8888a0' },
};

export default ProdutoPage;