import React, { useState, useEffect } from 'react';
import { api } from './api/api';

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

// DADOS INICIAIS
const PRODUTOS_INICIAIS: Produto[] = [
  { id_produto: 1, codigo: 'PROD-001', nome: 'Notebook Dell', descricao: '15.6 polegadas, 8GB RAM, 256GB SSD', id_categoria: 1, preco_unitario: 3499.90, quantidade_disponivel: 15, quantidade_minima: 5, status: 'ATIVO' },
  { id_produto: 2, codigo: 'PROD-002', nome: 'Smartphone Samsung', descricao: '6.5 polegadas, 128GB, 5G', id_categoria: 1, preco_unitario: 2499.00, quantidade_disponivel: 8, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 3, codigo: 'PROD-003', nome: 'Camiseta Polo', descricao: 'Algodão 100%, tamanho G, azul marinho', id_categoria: 2, preco_unitario: 89.90, quantidade_disponivel: 50, quantidade_minima: 10, status: 'ATIVO' },
  { id_produto: 4, codigo: 'PROD-004', nome: 'Livro O Hobbit', descricao: 'Edição ilustrada, 320 páginas, capa dura', id_categoria: 3, preco_unitario: 79.90, quantidade_disponivel: 2, quantidade_minima: 5, status: 'INATIVO' },
  { id_produto: 5, codigo: 'PROD-005', nome: 'Fone Bluetooth', descricao: 'Cancelamento de ruído, bateria 20h, carregamento rápido', id_categoria: 1, preco_unitario: 199.90, quantidade_disponivel: 25, quantidade_minima: 8, status: 'ATIVO' },
  { id_produto: 6, codigo: 'PROD-006', nome: 'Monitor LG', descricao: '24 polegadas, Full HD, 75Hz, HDMI', id_categoria: 1, preco_unitario: 899.90, quantidade_disponivel: 3, quantidade_minima: 6, status: 'ATIVO' },
  { id_produto: 7, codigo: 'PROD-007', nome: 'Teclado Mecânico', descricao: 'Switches blue, RGB, ABNT2, 60%', id_categoria: 1, preco_unitario: 299.90, quantidade_disponivel: 12, quantidade_minima: 4, status: 'ATIVO' },
  { id_produto: 8, codigo: 'PROD-008', nome: 'Mouse Gamer', descricao: '1600 DPI, 7 botões programáveis, RGB', id_categoria: 1, preco_unitario: 149.90, quantidade_disponivel: 1, quantidade_minima: 3, status: 'ATIVO' },
];

const CATEGORIAS_INICIAIS: Categoria[] = [
  { id_categoria: 1, nome: 'Eletrônicos' },
  { id_categoria: 2, nome: 'Roupas' },
  { id_categoria: 3, nome: 'Livros' },
];

function App() {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_INICIAIS);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
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
    setLoading(true);
    try {
      const [produtosRes, categoriasRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
      ]);
      if (produtosRes.data && produtosRes.data.length > 0) setProdutos(produtosRes.data);
      if (categoriasRes.data && categoriasRes.data.length > 0) setCategorias(categoriasRes.data);
    } catch (error) {
      console.log('Usando dados locais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getCategoriaNome = (id: number) => {
    const categoria = categorias.find(c => c.id_categoria === id);
    return categoria ? categoria.nome : 'N/A';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo.trim()) { alert('Código é obrigatório!'); return; }
    if (!formData.nome.trim()) { alert('Nome é obrigatório!'); return; }
    if (formData.id_categoria === 0) { alert('Selecione uma categoria!'); return; }
    if (formData.preco_unitario <= 0) { alert('Preço deve ser maior que zero!'); return; }
    if (formData.quantidade_disponivel < 0) { alert('Quantidade não pode ser negativa!'); return; }

    try {
      if (editing) {
        await api.put(`/produtos/${editing.id_produto}`, formData);
        alert('Produto atualizado!');
      } else {
        await api.post('/produtos', formData);
        alert('Produto criado!');
      }
      await loadData();
      setEditing(null);
      setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' });
      setActiveTab('dashboard');
    } catch (error) {
      if (editing) {
        setProdutos(produtos.map(p => p.id_produto === editing.id_produto ? { ...formData, id_produto: editing.id_produto } : p));
        alert('Produto atualizado localmente!');
      } else {
        setProdutos([...produtos, { ...formData, id_produto: Date.now() }]);
        alert('Produto criado localmente!');
      }
      setEditing(null);
      setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' });
      setActiveTab('dashboard');
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
    setActiveTab('cadastro');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza?')) {
      try {
        await api.delete(`/produtos/${id}`);
        alert('Produto excluído!');
        await loadData();
      } catch (error) {
        setProdutos(produtos.filter(p => p.id_produto !== id));
        alert('Produto excluído localmente!');
      }
    }
  };

  // FILTROS
  const filteredProdutos = produtos.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'TODOS' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const reposicaoNecessaria = produtos.filter(p => p.quantidade_disponivel <= p.quantidade_minima && p.status === 'ATIVO');

  // ESTATÍSTICAS
  const total = produtos.length;
  const ativos = produtos.filter(p => p.status === 'ATIVO').length;
  const inativos = produtos.filter(p => p.status === 'INATIVO').length;
  const baixoEstoque = reposicaoNecessaria.length;
  const valorTotal = produtos.reduce((sum, p) => sum + (p.preco_unitario * p.quantidade_disponivel), 0);

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏪</span>
            <h1 style={styles.logoTitle}>Controle de Estoque</h1>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.headerBadge}>📦 {total} produtos</span>
            <button style={styles.btnReload} onClick={loadData}>🔄</button>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div style={styles.tabs}>
        {['dashboard', 'produtos', 'reposicao', 'cadastro'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if (tab === 'cadastro') setEditing(null); }}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
          >
            {tab === 'dashboard' && '📊 Visão Geral'}
            {tab === 'produtos' && '📦 Produtos'}
            {tab === 'reposicao' && '🔄 Reposição'}
            {tab === 'cadastro' && (editing ? '✏️ Editar' : '➕ Cadastro')}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <main style={styles.main}>
        {/* ============ DASHBOARD ============ */}
        {activeTab === 'dashboard' && (
          <div>
            {/* CARDS */}
            <div style={styles.grid}>
              {[
                { title: 'Total de Produtos', value: total, icon: '📦', color: '#4a90d9', bg: 'linear-gradient(135deg, #e8f0fe, #d4e4ff)', trend: `${total} itens` },
                { title: 'Produtos Ativos', value: ativos, icon: '✅', color: '#28a745', bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', trend: `${ativos} ativos` },
                { title: 'Produtos Inativos', value: inativos, icon: '⛔', color: '#dc3545', bg: 'linear-gradient(135deg, #fce4ec, #f8d7da)', trend: `${inativos} inativos` },
                { title: '⚠️ Estoque Baixo', value: baixoEstoque, icon: '🔔', color: '#ffc107', bg: 'linear-gradient(135deg, #fff3cd, #ffe69b)', trend: `${baixoEstoque} alertas` },
                { title: '💰 Valor Total', value: `R$ ${valorTotal.toFixed(2)}`, icon: '💵', color: '#6c5ce7', bg: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', trend: 'Total investido' },
              ].map((card, i) => (
                <div key={i} style={{ ...styles.card, borderTop: `4px solid ${card.color}`, background: card.bg }}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardIcon}>{card.icon}</span>
                    <span style={{ ...styles.cardValue, color: card.color }}>{card.value}</span>
                  </div>
                  <p style={styles.cardTitle}>{card.title}</p>
                  <span style={{ ...styles.cardTrend, color: card.color }}>{card.trend}</span>
                </div>
              ))}
            </div>

            {/* ALERTA */}
            {baixoEstoque > 0 && (
              <div style={styles.alert}>
                <span style={styles.alertIcon}>⚠️</span>
                <span style={styles.alertText}>
                  <strong>{baixoEstoque} produtos</strong> com estoque abaixo do mínimo!
                </span>
                <button style={styles.alertBtn} onClick={() => setActiveTab('reposicao')}>Ver todos</button>
              </div>
            )}

            {/* TOP PRODUTOS */}
            <div style={styles.tableContainer}>
              <div style={styles.tableHeader}>
                <h3 style={styles.tableTitle}>🏆 Produtos Mais Valiosos</h3>
                <span style={styles.tableBadge}>Top 5</span>
              </div>
              <div style={styles.table}>
                <div style={{ ...styles.tableRow, ...styles.tableHead }}>
                  <span style={styles.th}>#</span>
                  <span style={styles.th}>Produto</span>
                  <span style={styles.th}>Preço</span>
                  <span style={styles.th}>Estoque</span>
                </div>
                {[...produtos].sort((a, b) => b.preco_unitario - a.preco_unitario).slice(0, 5).map((p, i) => (
                  <div key={p.id_produto} style={{ ...styles.tableRow, backgroundColor: i % 2 === 0 ? '#f8f9fa' : 'transparent' }}>
                    <span style={{ ...styles.td, ...styles.tdRank }}>{i + 1}</span>
                    <span style={styles.td}>{p.nome}</span>
                    <span style={{ ...styles.td, color: '#28a745', fontWeight: 600 }}>R$ {p.preco_unitario.toFixed(2)}</span>
                    <span style={styles.td}>{p.quantidade_disponivel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
              <span style={styles.footerText}>📊 Dados atualizados automaticamente</span>
              <span style={styles.footerText}>🕒 {new Date().toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* ============ PRODUTOS ============ */}
        {activeTab === 'produtos' && (
          <div>
            <div style={styles.filterBar}>
              <input
                type="text"
                placeholder="🔍 Buscar produto por nome ou código..."
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

            <div style={styles.gridProdutos}>
              {filteredProdutos.map((p) => (
                <div key={p.id_produto} style={{ ...styles.cardProduto, opacity: p.status === 'ATIVO' ? 1 : 0.6 }}>
                  <div style={styles.cardProdutoHeader}>
                    <div>
                      <h3 style={styles.cardProdutoTitle}>{p.nome}</h3>
                      <span style={styles.cardProdutoCode}>#{p.codigo}</span>
                    </div>
                    <span style={{ ...styles.badge, backgroundColor: p.status === 'ATIVO' ? '#d4edda' : '#f8d7da', color: p.status === 'ATIVO' ? '#155724' : '#721c24' }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={styles.cardProdutoDesc}>{p.descricao || 'Sem descrição'}</p>
                  <div style={styles.cardProdutoDetails}>
                    <div><strong>📂 Categoria:</strong> {getCategoriaNome(p.id_categoria)}</div>
                    <div><strong>💰 Preço:</strong> R$ {p.preco_unitario.toFixed(2)}</div>
                    <div><strong>📦 Estoque:</strong> {p.quantidade_disponivel}</div>
                    <div><strong>📉 Mínimo:</strong> {p.quantidade_minima}</div>
                  </div>
                  <div style={styles.cardProdutoActions}>
                    <button style={styles.btnEdit} onClick={() => handleEdit(p)}>✏️ Editar</button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(p.id_produto!)}>🗑️ Excluir</button>
                  </div>
                </div>
              ))}
            </div>
            {filteredProdutos.length === 0 && (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📭</span>
                <p>Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        )}

        {/* ============ REPOSIÇÃO ============ */}
        {activeTab === 'reposicao' && (
          <div>
            <div style={styles.reposicaoHeader}>
              <h2 style={styles.sectionTitle}>🔄 Reposição de Estoque</h2>
              <div style={styles.reposicaoBadges}>
                <span style={{ ...styles.badge, backgroundColor: '#dc3545', color: '#fff' }}>
                  ⚠️ {reposicaoNecessaria.length} precisam repor
                </span>
                <span style={{ ...styles.badge, backgroundColor: '#28a745', color: '#fff' }}>
                  ✅ {ativos} com estoque ok
                </span>
              </div>
            </div>

            {reposicaoNecessaria.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>🎉</span>
                <p style={styles.emptyTitle}>Tudo em ordem!</p>
                <p style={styles.emptySub}>Nenhum produto com estoque baixo.</p>
              </div>
            ) : (
              <div style={styles.gridProdutos}>
                {reposicaoNecessaria.map((p) => (
                  <div key={p.id_produto} style={{ ...styles.cardProduto, border: '2px solid #dc3545', backgroundColor: '#fff5f5' }}>
                    <div style={styles.cardProdutoHeader}>
                      <div>
                        <h3 style={styles.cardProdutoTitle}>{p.nome}</h3>
                        <span style={styles.cardProdutoCode}>#{p.codigo}</span>
                      </div>
                      <span style={styles.statusDanger}>⚠️ Baixo</span>
                    </div>
                    <p style={styles.cardProdutoDesc}>{p.descricao || 'Sem descrição'}</p>
                    <div style={styles.cardProdutoDetails}>
                      <div><strong>📂 Categoria:</strong> {getCategoriaNome(p.id_categoria)}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>📦 Atual:</strong> {p.quantidade_disponivel}</span>
                        <span><strong>📉 Mínimo:</strong> {p.quantidade_minima}</span>
                      </div>
                      <div style={styles.needAlert}>
                        📦 <strong>Necessário repor:</strong> {p.quantidade_minima - p.quantidade_disponivel} unidades
                      </div>
                    </div>
                    <div style={styles.progressContainer}>
                      <div style={{ ...styles.progressBar, width: `${Math.min((p.quantidade_disponivel / p.quantidade_minima) * 100, 100)}%`, backgroundColor: '#dc3545' }} />
                    </div>
                    <div style={styles.progressLabel}>
                      <span>{Math.min((p.quantidade_disponivel / p.quantidade_minima) * 100, 100).toFixed(0)}% do mínimo</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ CADASTRO ============ */}
        {activeTab === 'cadastro' && (
          <div>
            <div style={styles.cadastroHeader}>
              <h2 style={styles.sectionTitle}>{editing ? '✏️ Editar Produto' : '➕ Cadastrar Produto'}</h2>
              <p style={styles.cadastroSub}>{editing ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar um novo produto'}</p>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📝 Código *</label>
                  <input required value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} style={styles.input} placeholder="Ex: PROD-001" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📝 Nome *</label>
                  <input required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} style={styles.input} placeholder="Nome do produto" />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📝 Descrição</label>
                <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} style={styles.textarea} rows={2} placeholder="Descrição do produto" />
              </div>

              <div style={styles.formRow2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📂 Categoria *</label>
                  <select required value={formData.id_categoria} onChange={(e) => setFormData({ ...formData, id_categoria: parseInt(e.target.value) })} style={styles.select}>
                    <option value={0}>Selecione...</option>
                    {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nome}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📊 Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ATIVO' | 'INATIVO' })} style={styles.select}>
                    <option value="ATIVO">✅ Ativo</option>
                    <option value="INATIVO">⛔ Inativo</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>💰 Preço (R$) *</label>
                  <input type="number" step="0.01" min="0.01" required value={formData.preco_unitario || ''} onChange={(e) => setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) || 0 })} style={styles.input} placeholder="0,00" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📦 Quantidade *</label>
                  <input type="number" min="0" required value={formData.quantidade_disponivel} onChange={(e) => setFormData({ ...formData, quantidade_disponivel: parseInt(e.target.value) || 0 })} style={styles.input} placeholder="0" />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📉 Quantidade Mínima *</label>
                <input type="number" min="0" required value={formData.quantidade_minima} onChange={(e) => setFormData({ ...formData, quantidade_minima: parseInt(e.target.value) || 0 })} style={styles.input} placeholder="0" />
              </div>

              <div style={styles.formActions}>
                {editing && <button type="button" style={styles.btnCancel} onClick={() => { setEditing(null); setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' }); setActiveTab('dashboard'); }}>Cancelar</button>}
                <button type="submit" style={styles.btnSubmit}>{editing ? '💾 Atualizar Produto' : '📦 Cadastrar Produto'}</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    color: '#666',
  },
  header: {
    backgroundColor: '#1a1a2e',
    padding: '0 2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    borderBottom: '3px solid #4a90d9',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  logoTitle: {
    color: '#fff',
    fontSize: '1.4rem',
    margin: 0,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #4a90d9, #6c5ce7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  headerBadge: {
    color: '#a0a0b0',
    fontSize: '0.9rem',
  },
  btnReload: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    padding: '0.4rem 0.6rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabs: {
    display: 'flex',
    gap: '0.25rem',
    backgroundColor: '#fff',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid #e8ecf1',
    maxWidth: '1400px',
    margin: '0 auto',
    flexWrap: 'wrap' as const,
  },
  tab: {
    padding: '0.6rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'transparent',
    color: '#666',
    fontFamily: 'inherit',
  },
  tabActive: {
    background: '#4a90d9',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(74,144,217,0.3)',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  card: {
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: '2rem',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 700,
  },
  cardTitle: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0.5rem 0 0',
    fontWeight: 500,
  },
  cardTrend: {
    fontSize: '0.75rem',
    fontWeight: 500,
    display: 'block',
    marginTop: '0.25rem',
  },
  alert: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
  },
  alertIcon: {
    fontSize: '1.5rem',
  },
  alertText: {
    fontSize: '1rem',
    color: '#856404',
  },
  alertBtn: {
    padding: '0.3rem 1rem',
    backgroundColor: '#ffc107',
    color: '#856404',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  tableTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  tableBadge: {
    fontSize: '0.75rem',
    color: '#fff',
    backgroundColor: '#6c5ce7',
    padding: '0.2rem 0.8rem',
    borderRadius: '12px',
    fontWeight: 600,
  },
  table: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  tableHead: {
    borderBottom: '2px solid #e0e0e0',
    marginBottom: '0.25rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 100px 80px',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    alignItems: 'center',
  },
  th: {
    fontWeight: 600,
    color: '#888',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  td: {
    color: '#333',
  },
  tdRank: {
    fontWeight: 700,
    color: '#6c5ce7',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    marginTop: '1rem',
    borderTop: '1px solid #e8ecf1',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  footerText: {
    fontSize: '0.8rem',
    color: '#999',
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  searchInput: {
    flex: 1,
    padding: '0.7rem 1rem',
    border: '2px solid #e8ecf1',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    minWidth: '200px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  filterSelect: {
    padding: '0.7rem 1rem',
    border: '2px solid #e8ecf1',
    borderRadius: '10px',
    fontSize: '0.95rem',
    backgroundColor: '#fff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  gridProdutos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  cardProduto: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e8ecf1',
    transition: 'all 0.3s ease',
  },
  cardProdutoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  cardProdutoTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  cardProdutoCode: {
    fontSize: '0.8rem',
    color: '#999',
  },
  cardProdutoDesc: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  cardProdutoDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.25rem 0.5rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  cardProdutoActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  btnEdit: {
    flex: 1,
    padding: '0.4rem 0.8rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  btnDelete: {
    flex: 1,
    padding: '0.4rem 0.8rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  badge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  statusDanger: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontWeight: 600,
  },
  needAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  progressContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e8ecf1',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '0.75rem',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  progressLabel: {
    fontSize: '0.7rem',
    color: '#999',
    textAlign: 'right' as const,
    marginTop: '0.2rem',
  },
  reposicaoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  reposicaoBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#333',
    margin: 0,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  emptySub: {
    fontSize: '0.95rem',
    color: '#999',
    margin: '0.25rem 0 0',
  },
  cadastroHeader: {
    marginBottom: '1.5rem',
  },
  cadastroSub: {
    fontSize: '0.95rem',
    color: '#888',
    margin: '0.25rem 0 0',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  formRow2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
    marginBottom: '0.25rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 600,
    color: '#555',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  select: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
  },
  formActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  btnCancel: {
    padding: '0.6rem 1.5rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  btnSubmit: {
    padding: '0.6rem 2rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
};

export default App;