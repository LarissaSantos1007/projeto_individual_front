import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api/api';
import { toCSV, downloadCSV } from '../utils/exportCsv';

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
  { id_produto: 2, codigo: 'PROD-002', nome: 'Smartphone Samsung Galaxy S23', descricao: '6.5 polegadas, 128GB, 5G, tela AMOLED', id_categoria: 1, preco_unitario: 2499.00, quantidade_disponivel: 8, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 3, codigo: 'PROD-003', nome: 'Monitor LG 24"', descricao: '24 polegadas, Full HD, 75Hz, HDMI, DisplayPort', id_categoria: 1, preco_unitario: 899.90, quantidade_disponivel: 3, quantidade_minima: 6, status: 'ATIVO' },
  { id_produto: 4, codigo: 'PROD-004', nome: 'Teclado Mecânico Redragon', descricao: 'Switches blue, RGB, ABNT2, 60%', id_categoria: 1, preco_unitario: 299.90, quantidade_disponivel: 12, quantidade_minima: 4, status: 'ATIVO' },
  { id_produto: 5, codigo: 'PROD-005', nome: 'Mouse Gamer Logitech', descricao: '1600 DPI, 7 botões programáveis, RGB, wireless', id_categoria: 1, preco_unitario: 149.90, quantidade_disponivel: 1, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 6, codigo: 'PROD-006', nome: 'Placa Mãe ASUS ROG', descricao: 'Socket LGA1200, DDR4, HDMI, PCIe 4.0', id_categoria: 1, preco_unitario: 799.90, quantidade_disponivel: 0, quantidade_minima: 2, status: 'ATIVO' },
  { id_produto: 7, codigo: 'PROD-007', nome: 'Fonte Corsair 500W', descricao: 'Fonte ATX, 80 Plus Bronze, modular', id_categoria: 1, preco_unitario: 349.90, quantidade_disponivel: 0, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 8, codigo: 'PROD-008', nome: 'SSD Kingston 480GB', descricao: 'SSD SATA III, leitura 500MB/s, 2.5 polegadas', id_categoria: 1, preco_unitario: 279.90, quantidade_disponivel: 4, quantidade_minima: 4, status: 'ATIVO' },
  { id_produto: 9, codigo: 'PROD-009', nome: 'Memória RAM HyperX 16GB', descricao: 'DDR4, 3200MHz, RGB, 2x8GB', id_categoria: 1, preco_unitario: 399.90, quantidade_disponivel: 2, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 10, codigo: 'PROD-010', nome: 'Headset Gamer HyperX', descricao: 'Som surround 7.1, microfone removível, USB', id_categoria: 1, preco_unitario: 459.90, quantidade_disponivel: 0, quantidade_minima: 2, status: 'ATIVO' },
  { id_produto: 11, codigo: 'PROD-011', nome: 'Roteador TP-Link AC1200', descricao: 'Wi-Fi Dual Band, 4 antenas, porta Gigabit', id_categoria: 1, preco_unitario: 199.90, quantidade_disponivel: 6, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 12, codigo: 'PROD-012', nome: 'Placa de Vídeo NVIDIA RTX 3060', descricao: '12GB GDDR6, Ray Tracing, DLSS', id_categoria: 1, preco_unitario: 2499.90, quantidade_disponivel: 0, quantidade_minima: 2, status: 'ATIVO' },
  { id_produto: 13, codigo: 'PROD-013', nome: 'Processador Intel i7-12700K', descricao: '12 núcleos, 20 threads, 5.0GHz', id_categoria: 1, preco_unitario: 2199.90, quantidade_disponivel: 0, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 14, codigo: 'PROD-014', nome: 'Webcam Logitech C920', descricao: 'Full HD 1080p, microfone estéreo, autofoco', id_categoria: 1, preco_unitario: 299.90, quantidade_disponivel: 5, quantidade_minima: 2, status: 'ATIVO' },
  { id_produto: 15, codigo: 'PROD-015', nome: 'Switch TP-Link 8 Portas', descricao: 'Gigabit, 8 portas, metal', id_categoria: 1, preco_unitario: 159.90, quantidade_disponivel: 0, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 16, codigo: 'PROD-016', nome: 'Fone Bluetooth JBL', descricao: 'Cancelamento de ruído, bateria 20h, carregamento rápido', id_categoria: 1, preco_unitario: 199.90, quantidade_disponivel: 25, quantidade_minima: 8, status: 'ATIVO' },
];

const CATEGORIAS_EXEMPLO: Categoria[] = [
  { id_categoria: 1, nome: 'Tecnologia' },
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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
        const sorted = [...prodRes.data].sort((a, b) => (a.id_produto || 0) - (b.id_produto || 0));
        setProdutos(sorted);
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

  // ===== VALIDAÇÕES =====
  const validarCampos = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório!';
      isValid = false;
    } else if (formData.codigo.length < 3) {
      newErrors.codigo = 'Código deve ter no mínimo 3 caracteres!';
      isValid = false;
    } else if (formData.codigo.length > 50) {
      newErrors.codigo = 'Código deve ter no máximo 50 caracteres!';
      isValid = false;
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório!';
      isValid = false;
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter no mínimo 3 caracteres!';
      isValid = false;
    } else if (formData.nome.length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres!';
      isValid = false;
    }

    if (formData.id_categoria === 0) {
      newErrors.id_categoria = 'Categoria é obrigatória!';
      isValid = false;
    }

    if (formData.preco_unitario <= 0) {
      newErrors.preco_unitario = 'Preço deve ser maior que zero!';
      isValid = false;
    }

    if (formData.quantidade_disponivel < 0) {
      newErrors.quantidade_disponivel = 'Quantidade não pode ser negativa!';
      isValid = false;
    }

    if (formData.quantidade_minima < 0) {
      newErrors.quantidade_minima = 'Quantidade mínima não pode ser negativa!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarCampos()) {
      toast.error('Corrija os erros antes de continuar!');
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
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao atualizar!');
      }
    } else {
      const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id_produto || 0)) + 1 : 1;
      const novoProduto = { ...formData, id_produto: novoId };
      const novosProdutos = [...produtos, novoProduto].sort((a, b) => (a.id_produto || 0) - (b.id_produto || 0));
      setProdutos(novosProdutos);
      toast.success('Produto criado! ✅');
      
      try {
        await api.post('/produtos', formData);
        await loadData();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao criar!');
      }
    }
    
    setShowForm(false);
    setEditing(null);
    setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' });
    setErrors({});
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
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id_produto !== id));
      toast.success('Produto excluído! 🗑️');
      try {
        await api.delete(`/produtos/${id}`);
        await loadData();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao excluir!');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' });
    setErrors({});
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
        <div style={{display:'flex', gap:8}}>
          <button style={styles.btnPrimary} onClick={() => { setShowForm(true); setEditing(null); setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' }); setErrors({}); }}>
            ➕ Novo Produto
          </button>
          <button style={styles.btnSecondary} onClick={() => {
            const csv = toCSV(filteredProdutos, ['id_produto','codigo','nome','preco_unitario','quantidade_disponivel','quantidade_minima','status']);
            downloadCSV('produtos_export.csv', csv);
          }}>📤 Exportar CSV</button>
        </div>
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
          <h2>{editing ? '✏️ Editar Produto' : '📝 Novo Produto'}</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Código *</label>
            <input
              required
              placeholder="Ex: PROD-001"
              value={formData.codigo}
              onChange={(e) => {
                setFormData({ ...formData, codigo: e.target.value });
                if (errors.codigo) setErrors({ ...errors, codigo: '' });
              }}
              style={{ ...styles.input, ...(errors.codigo ? styles.inputError : {}) }}
            />
            {errors.codigo && <span style={styles.errorText}>{errors.codigo}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nome *</label>
            <input
              required
              placeholder="Nome do produto"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
                if (errors.nome) setErrors({ ...errors, nome: '' });
              }}
              style={{ ...styles.input, ...(errors.nome ? styles.inputError : {}) }}
            />
            {errors.nome && <span style={styles.errorText}>{errors.nome}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Descrição</label>
            <input
              placeholder="Descrição do produto"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categoria *</label>
            <select
              required
              value={formData.id_categoria}
              onChange={(e) => {
                setFormData({ ...formData, id_categoria: parseInt(e.target.value) });
                if (errors.id_categoria) setErrors({ ...errors, id_categoria: '' });
              }}
              style={{ ...styles.select, ...(errors.id_categoria ? styles.inputError : {}) }}
            >
              <option value={0}>Selecione uma categoria...</option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>{c.nome}</option>
              ))}
            </select>
            {errors.id_categoria && <span style={styles.errorText}>{errors.id_categoria}</span>}
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0,00"
                value={formData.preco_unitario || ''}
                onChange={(e) => {
                  setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) || 0 });
                  if (errors.preco_unitario) setErrors({ ...errors, preco_unitario: '' });
                }}
                style={{ ...styles.input, ...(errors.preco_unitario ? styles.inputError : {}) }}
              />
              {errors.preco_unitario && <span style={styles.errorText}>{errors.preco_unitario}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantidade Disponível *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="0"
                value={formData.quantidade_disponivel || ''}
                onChange={(e) => {
                  setFormData({ ...formData, quantidade_disponivel: parseInt(e.target.value) || 0 });
                  if (errors.quantidade_disponivel) setErrors({ ...errors, quantidade_disponivel: '' });
                }}
                style={{ ...styles.input, ...(errors.quantidade_disponivel ? styles.inputError : {}) }}
              />
              {errors.quantidade_disponivel && <span style={styles.errorText}>{errors.quantidade_disponivel}</span>}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Quantidade Mínima *</label>
            <input
              type="number"
              min="0"
              required
              placeholder="0"
              value={formData.quantidade_minima || ''}
              onChange={(e) => {
                setFormData({ ...formData, quantidade_minima: parseInt(e.target.value) || 0 });
                if (errors.quantidade_minima) setErrors({ ...errors, quantidade_minima: '' });
              }}
              style={{ ...styles.input, ...(errors.quantidade_minima ? styles.inputError : {}) }}
            />
            {errors.quantidade_minima && <span style={styles.errorText}>{errors.quantidade_minima}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ATIVO' | 'INATIVO' })}
              style={styles.select}
            >
              <option value="ATIVO">✅ ATIVO</option>
              <option value="INATIVO">⛔ INATIVO</option>
            </select>
          </div>

          <div style={styles.formActions}>
            <button type="button" style={styles.btnSecondary} onClick={handleCancel}>
              Cancelar
            </button>
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
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#a0a0b8', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.7rem', border: '1px solid rgba(253,121,168,0.2)', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  inputError: { borderColor: '#e74c3c', boxShadow: '0 0 0 2px rgba(231,76,60,0.1)' },
  errorText: { color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' },
  select: { width: '100%', padding: '0.7rem', border: '1px solid rgba(253,121,168,0.2)', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
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