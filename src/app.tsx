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
  { id_produto: 1, codigo: 'PROD-001', nome: 'Notebook Dell', descricao: '15.6 polegadas, 8GB RAM', id_categoria: 1, preco_unitario: 3499.90, quantidade_disponivel: 15, quantidade_minima: 5, status: 'ATIVO' },
  { id_produto: 2, codigo: 'PROD-002', nome: 'Smartphone Samsung', descricao: '6.5 polegadas, 128GB', id_categoria: 1, preco_unitario: 2499.00, quantidade_disponivel: 8, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 3, codigo: 'PROD-003', nome: 'Camiseta Polo', descricao: 'Algodão 100%, tamanho G', id_categoria: 2, preco_unitario: 89.90, quantidade_disponivel: 50, quantidade_minima: 10, status: 'ATIVO' },
  { id_produto: 4, codigo: 'PROD-004', nome: 'Livro O Hobbit', descricao: 'Edição ilustrada, 320 páginas', id_categoria: 3, preco_unitario: 79.90, quantidade_disponivel: 2, quantidade_minima: 5, status: 'INATIVO' },
  { id_produto: 5, codigo: 'PROD-005', nome: 'Fone Bluetooth', descricao: 'Cancelamento de ruído, 20h', id_categoria: 1, preco_unitario: 199.90, quantidade_disponivel: 1, quantidade_minima: 8, status: 'ATIVO' },
  { id_produto: 6, codigo: 'PROD-006', nome: 'Monitor LG', descricao: '24 polegadas, Full HD', id_categoria: 1, preco_unitario: 899.90, quantidade_disponivel: 0, quantidade_minima: 6, status: 'ATIVO' },
  { id_produto: 7, codigo: 'PROD-007', nome: 'Teclado Mecânico', descricao: 'Switches blue, RGB', id_categoria: 1, preco_unitario: 299.90, quantidade_disponivel: 0, quantidade_minima: 4, status: 'ATIVO' },
  { id_produto: 8, codigo: 'PROD-008', nome: 'Mouse Gamer', descricao: '1600 DPI, 7 botões', id_categoria: 1, preco_unitario: 149.90, quantidade_disponivel: 0, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 9, codigo: 'PROD-009', nome: 'Placa Mãe ASUS', descricao: 'Socket LGA1200, DDR4', id_categoria: 1, preco_unitario: 799.90, quantidade_disponivel: 0, quantidade_minima: 2, status: 'ATIVO' },
  { id_produto: 10, codigo: 'PROD-010', nome: 'Fonte 500W', descricao: 'Fonte ATX, 80 Plus', id_categoria: 1, preco_unitario: 349.90, quantidade_disponivel: 0, quantidade_minima: 3, status: 'ATIVO' },
];

const CATEGORIAS_INICIAIS: Categoria[] = [
  { id_categoria: 1, nome: 'Eletrônicos' },
  { id_categoria: 2, nome: 'Roupas' },
  { id_categoria: 3, nome: 'Livros' },
];

function App() {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_INICIAIS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [editing, setEditing] = useState<Produto | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  const getCategoriaNome = (id: number) => {
    const cat = categorias.find(c => c.id_categoria === id);
    return cat ? cat.nome : 'N/A';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo.trim() || !formData.nome.trim() || formData.id_categoria === 0 || formData.preco_unitario <= 0) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    if (editing) {
      setProdutos(produtos.map(p => p.id_produto === editing.id_produto ? { ...formData, id_produto: editing.id_produto } : p));
      alert('Produto atualizado!');
    } else {
      setProdutos([...produtos, { ...formData, id_produto: Date.now() }]);
      alert('Produto criado!');
    }
    setShowForm(false);
    setEditing(null);
    setFormData({ codigo: '', nome: '', descricao: '', id_categoria: 0, preco_unitario: 0, quantidade_disponivel: 0, quantidade_minima: 0, status: 'ATIVO' });
  };

  const handleEdit = (p: Produto) => {
    setEditing(p);
    setFormData({
      codigo: p.codigo,
      nome: p.nome,
      descricao: p.descricao || '',
      id_categoria: p.id_categoria,
      preco_unitario: p.preco_unitario,
      quantidade_disponivel: p.quantidade_disponivel,
      quantidade_minima: p.quantidade_minima,
      status: p.status,
    });
    setShowForm(true);
    setActiveTab('cadastro');
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza?')) {
      setProdutos(produtos.filter(p => p.id_produto !== id));
    }
  };

  const total = produtos.length;
  const ativos = produtos.filter(p => p.status === 'ATIVO').length;
  const inativos = produtos.filter(p => p.status === 'INATIVO').length;
  const baixoEstoque = produtos.filter(p => p.quantidade_disponivel <= p.quantidade_minima && p.status === 'ATIVO').length;
  const valorTotal = produtos.reduce((sum, p) => sum + (p.preco_unitario * p.quantidade_disponivel), 0);

  const filteredProdutos = produtos.filter(p => {
    const match = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const status = filterStatus === 'TODOS' || p.status === filterStatus;
    return match && status;
  });

  const reposicao = produtos.filter(p => p.quantidade_disponivel <= p.quantidade_minima && p.status === 'ATIVO');
  const zerados = reposicao.filter(p => p.quantidade_disponivel === 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>;

  // Estilos inline
  const styles = {
    app: { minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    header: { backgroundColor: '#1a1a2e', padding: '15px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontSize: '24px', fontWeight: 'bold' },
    tabs: { display: 'flex', gap: '10px', backgroundColor: 'white', padding: '10px', borderBottom: '1px solid #ddd', flexWrap: 'wrap' as const },
    tab: { padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '5px' },
    tabActive: { background: '#007bff', color: 'white' },
    card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' },
    cardValue: { fontSize: '28px', fontWeight: 'bold', color: '#007bff' },
    cardTitle: { color: '#666', fontSize: '14px' },
    btn: { padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' },
    btnEdit: { background: '#007bff', color: 'white' },
    btnDelete: { background: '#dc3545', color: 'white' },
    btnRepor: { background: '#28a745', color: 'white' },
    btnPrimary: { background: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnDanger: { background: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' },
    select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' },
    textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px', minHeight: '60px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' },
    alert: { background: '#fff3cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '5px', marginBottom: '15px' },
    badge: { padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    badgeDanger: { background: '#dc3545', color: 'white' },
    badgeWarning: { background: '#ffc107', color: '#333' },
    empty: { textAlign: 'center' as const, padding: '40px', color: '#999' },
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <span style={styles.logo}>🏪 Controle de Estoque</span>
        <span>📦 {total} produtos</span>
      </header>

      <div style={styles.tabs}>
        <button onClick={() => { setActiveTab('dashboard'); setShowForm(false); }} style={{ ...styles.tab, ...(activeTab === 'dashboard' ? styles.tabActive : {}) }}>📊 Início</button>
        <button onClick={() => { setActiveTab('produtos'); setShowForm(false); }} style={{ ...styles.tab, ...(activeTab === 'produtos' ? styles.tabActive : {}) }}>📦 Produtos</button>
        <button onClick={() => { setActiveTab('reposicao'); setShowForm(false); }} style={{ ...styles.tab, ...(activeTab === 'reposicao' ? styles.tabActive : {}) }}>🔄 Reposição ({reposicao.length})</button>
        <button onClick={() => { setActiveTab('cadastro'); setShowForm(true); setEditing(null); }} style={{ ...styles.tab, ...(activeTab === 'cadastro' ? styles.tabActive : {}) }}>➕ Cadastro</button>
      </div>

      <div style={styles.container}>
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={styles.card}>
              <h2>👋 Bem-vindo ao Sistema de Estoque</h2>
              <p>Gerencie seus produtos, controle o estoque e acompanhe suas vendas em um só lugar.</p>
              <button style={styles.btnPrimary} onClick={() => { setActiveTab('cadastro'); setShowForm(true); setEditing(null); }}>➕ Adicionar Produto</button>
            </div>

            <div style={styles.grid}>
              <div style={styles.card}><div style={styles.cardValue}>{total}</div><div style={styles.cardTitle}>Total de Produtos</div></div>
              <div style={styles.card}><div style={styles.cardValue}>{ativos}</div><div style={styles.cardTitle}>Produtos Ativos</div></div>
              <div style={styles.card}><div style={styles.cardValue}>{inativos}</div><div style={styles.cardTitle}>Produtos Inativos</div></div>
              <div style={styles.card}><div style={styles.cardValue}>{baixoEstoque}</div><div style={styles.cardTitle}>⚠️ Estoque Baixo</div></div>
              <div style={styles.card}><div style={styles.cardValue}>R$ {valorTotal.toFixed(2)}</div><div style={styles.cardTitle}>💰 Valor Total</div></div>
            </div>

            {baixoEstoque > 0 && (
              <div style={styles.alert}>
                ⚠️ <strong>{baixoEstoque} produtos</strong> com estoque abaixo do mínimo!
                <button style={styles.btnPrimary} onClick={() => setActiveTab('reposicao')}>Ver todos</button>
              </div>
            )}
          </div>
        )}

        {/* PRODUTOS */}
        {activeTab === 'produtos' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' as const }}>
              <input type="text" placeholder="🔍 Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...styles.select, width: '150px' }}>
                <option value="TODOS">Todos</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
              </select>
            </div>

            <div style={styles.grid2}>
              {filteredProdutos.map((p) => (
                <div key={p.id_produto} style={styles.card}>
                  <h3>{p.nome}</h3>
                  <span style={{ fontSize: '12px', color: '#999' }}>#{p.codigo}</span>
                  <p>{p.descricao || 'Sem descrição'}</p>
                  <div style={{ fontSize: '14px' }}>
                    <div><strong>Categoria:</strong> {getCategoriaNome(p.id_categoria)}</div>
                    <div><strong>Preço:</strong> R$ {p.preco_unitario.toFixed(2)}</div>
                    <div><strong>Estoque:</strong> {p.quantidade_disponivel}</div>
                    <div><strong>Mínimo:</strong> {p.quantidade_minima}</div>
                    <div><strong>Status:</strong> {p.status}</div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <button style={{ ...styles.btn, ...styles.btnEdit }} onClick={() => handleEdit(p)}>✏️ Editar</button>
                    <button style={{ ...styles.btn, ...styles.btnDelete }} onClick={() => handleDelete(p.id_produto!)}>🗑️ Excluir</button>
                  </div>
                </div>
              ))}
            </div>
            {filteredProdutos.length === 0 && <div style={styles.empty}>Nenhum produto encontrado.</div>}
          </div>
        )}

        {/* REPOSIÇÃO */}
        {activeTab === 'reposicao' && (
          <div>
            <h2>🔄 Reposição de Estoque</h2>
            <p>Gerencie produtos com estoque baixo</p>

            <div style={styles.grid}>
              <div style={styles.card}><div style={styles.cardValue}>{reposicao.length}</div><div style={styles.cardTitle}>Produtos com estoque baixo</div></div>
              <div style={styles.card}><div style={styles.cardValue}>{zerados.length}</div><div style={styles.cardTitle}>Produtos com estoque zerado</div></div>
              <div style={styles.card}><div style={styles.cardValue}>R$ {reposicao.reduce((sum, p) => sum + (p.preco_unitario * (p.quantidade_minima - p.quantidade_disponivel)), 0).toFixed(2)}</div><div style={styles.cardTitle}>Valor necessário</div></div>
            </div>

            {reposicao.length === 0 ? (
              <div style={styles.card}><div style={{ fontSize: '48px', textAlign: 'center' }}>🎉</div><p style={{ textAlign: 'center' }}>Todos os produtos com estoque OK!</p></div>
            ) : (
              <div style={styles.grid2}>
                {reposicao.map((p) => {
                  const isZero = p.quantidade_disponivel === 0;
                  return (
                    <div key={p.id_produto} style={{ ...styles.card, border: isZero ? '2px solid #dc3545' : '2px solid #ffc107' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>{p.nome}</h3>
                        <span style={isZero ? { ...styles.badge, ...styles.badgeDanger } : { ...styles.badge, ...styles.badgeWarning }}>{isZero ? '🚨 ZERADO' : '⚠️ BAIXO'}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#999' }}>#{p.codigo}</span>
                      <p>{p.descricao || 'Sem descrição'}</p>
                      <div><strong>Categoria:</strong> {getCategoriaNome(p.id_categoria)}</div>
                      <div><strong>Atual:</strong> {p.quantidade_disponivel} | <strong>Mínimo:</strong> {p.quantidade_minima}</div>
                      <div style={{ background: '#dc3545', color: 'white', padding: '5px 10px', borderRadius: '5px', marginTop: '5px' }}><strong>Necessário repor:</strong> {p.quantidade_minima - p.quantidade_disponivel} unidades</div>
                      <div style={{ background: '#6c5ce7', color: 'white', padding: '5px 10px', borderRadius: '5px', marginTop: '5px' }}><strong>Valor:</strong> R$ {(p.preco_unitario * (p.quantidade_minima - p.quantidade_disponivel)).toFixed(2)}</div>
                      <div style={{ marginTop: '10px' }}>
                        <button style={{ ...styles.btn, ...styles.btnEdit }} onClick={() => handleEdit(p)}>✏️ Editar</button>
                        <button style={{ ...styles.btn, ...styles.btnRepor }} onClick={() => { handleEdit(p); setActiveTab('cadastro'); }}>📦 Repor</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CADASTRO */}
        {activeTab === 'cadastro' && (
          <div>
            <h2>{editing ? '✏️ Editar Produto' : '➕ Cadastrar Produto'}</h2>
            <p>{editing ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar um novo produto'}</p>
            <form onSubmit={handleSubmit} style={styles.card}>
              <div><label style={styles.label}>Código *</label><input required value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} style={styles.input} placeholder="Ex: PROD-001" /></div>
              <div><label style={styles.label}>Nome *</label><input required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} style={styles.input} placeholder="Nome do produto" /></div>
              <div><label style={styles.label}>Descrição</label><textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} style={styles.textarea} placeholder="Descrição do produto" /></div>
              <div><label style={styles.label}>Categoria *</label><select required value={formData.id_categoria} onChange={(e) => setFormData({ ...formData, id_categoria: parseInt(e.target.value) })} style={styles.select}><option value={0}>Selecione...</option>{categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nome}</option>)}</select></div>
              <div><label style={styles.label}>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ATIVO' | 'INATIVO' })} style={styles.select}><option value="ATIVO">✅ Ativo</option><option value="INATIVO">⛔ Inativo</option></select></div>
              <div><label style={styles.label}>Preço (R$) *</label><input type="number" step="0.01" min="0.01" required value={formData.preco_unitario || ''} onChange={(e) => setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) || 0 })} style={styles.input} placeholder="0,00" /></div>
              <div><label style={styles.label}>Quantidade *</label><input type="number" min="0" required value={formData.quantidade_disponivel} onChange={(e) => setFormData({ ...formData, quantidade_disponivel: parseInt(e.target.value) || 0 })} style={styles.input} placeholder="0" /></div>
              <div><label style={styles.label}>Quantidade Mínima *</label><input type="number" min="0" required value={formData.quantidade_minima} onChange={(e) => setFormData({ ...formData, quantidade_minima: parseInt(e.target.value) || 0 })} style={styles.input} placeholder="0" /></div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {editing && <button type="button" style={styles.btnDanger} onClick={() => { setEditing(null); setShowForm(false); setActiveTab('dashboard'); }}>Cancelar</button>}
                <button type="submit" style={styles.btnPrimary}>{editing ? '💾 Atualizar' : '📦 Cadastrar'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;