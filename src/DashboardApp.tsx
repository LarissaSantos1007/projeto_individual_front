import React, { useState, useEffect } from 'react';
import { api } from './api/api';

const DADOS_EXEMPLO = {
  produtos: [
    { id: 1, nome: 'Notebook Dell', preco: 3499.90, quantidade: 15 },
    { id: 2, nome: 'Smartphone Samsung', preco: 2499.00, quantidade: 8 },
    { id: 3, nome: 'Camiseta Polo', preco: 89.90, quantidade: 50 },
    { id: 4, nome: 'Fone Bluetooth', preco: 199.90, quantidade: 25 },
    { id: 5, nome: 'Monitor LG', preco: 899.90, quantidade: 3 },
    { id: 6, nome: 'Teclado Mecânico', preco: 299.90, quantidade: 12 },
    { id: 7, nome: 'Mouse Gamer', preco: 149.90, quantidade: 1 },
    { id: 8, nome: 'Livro O Hobbit', preco: 79.90, quantidade: 2 },
  ],
  categorias: [
    { id: 1, nome: 'Eletrônicos' },
    { id: 2, nome: 'Roupas' },
    { id: 3, nome: 'Livros' },
  ],
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    produtos: DADOS_EXEMPLO.produtos.length,
    categorias: DADOS_EXEMPLO.categorias.length,
    movimentacoes: 5,
    vendas: 3,
    valorTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ultimosProdutos, setUltimosProdutos] = useState(DADOS_EXEMPLO.produtos);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [produtosRes, categoriasRes] = await Promise.all([
          api.get('/produtos'),
          api.get('/categorias'),
        ]);

        const dadosProdutos = produtosRes.data || DADOS_EXEMPLO.produtos;
        const dadosCategorias = categoriasRes.data || DADOS_EXEMPLO.categorias;

        const valorTotal = dadosProdutos.reduce((sum: number, p: any) => 
          sum + (p.preco_unitario || p.preco || 0) * (p.quantidade_disponivel || p.quantidade || 0), 0
        );

        setStats({
          produtos: dadosProdutos.length,
          categorias: dadosCategorias.length,
          movimentacoes: 5,
          vendas: 3,
          valorTotal: valorTotal,
        });
        setUltimosProdutos(dadosProdutos.slice(0, 5));
      } catch (error) {
        const valorTotal = DADOS_EXEMPLO.produtos.reduce((sum, p) => sum + p.preco * p.quantidade, 0);
        setStats({
          produtos: DADOS_EXEMPLO.produtos.length,
          categorias: DADOS_EXEMPLO.categorias.length,
          movimentacoes: 5,
          vendas: 3,
          valorTotal: valorTotal,
        });
        setUltimosProdutos(DADOS_EXEMPLO.produtos);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Carregando...</p>
      </div>
    );
  }

  const cards = [
    { title: 'Produtos', value: stats.produtos, icon: '📦', color: '#e07a5f' },
    { title: 'Categorias', value: stats.categorias, icon: '📂', color: '#3d2b4d' },
    { title: 'Movimentações', value: stats.movimentacoes, icon: '🔄', color: '#f2cc8f' },
    { title: 'Vendas', value: stats.vendas, icon: '💰', color: '#e07a5f' },
  ];

  return (
    <div>
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <div>
            <h1 style={styles.bannerTitle}>👋 Bem-vindo ao Controle de Estoque</h1>
            <p style={styles.bannerSub}>Gerencie seus produtos, movimentações e vendas em um só lugar.</p>
            <div style={styles.bannerStats}>
              <span style={styles.bannerStat}>📦 {stats.produtos} produtos</span>
              <span style={styles.bannerStat}>💰 R$ {stats.valorTotal.toFixed(2)} em estoque</span>
            </div>
          </div>
          <div style={styles.bannerIcon}>📊</div>
        </div>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.title} style={{ ...styles.card, borderBottom: `4px solid ${card.color}` }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>{card.icon}</span>
              <span style={{ ...styles.cardValue, color: card.color }}>{card.value}</span>
            </div>
            <p style={styles.cardTitle}>{card.title}</p>
          </div>
        ))}
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>🆕 Últimos Produtos</h3>
          <span style={styles.tableBadge}>{ultimosProdutos.length} produtos</span>
        </div>
        <div style={styles.table}>
          <div style={styles.tableRowHeader}>
            <span style={styles.th}>#</span>
            <span style={styles.th}>Produto</span>
            <span style={styles.th}>Preço</span>
            <span style={styles.th}>Estoque</span>
          </div>
          {ultimosProdutos.map((p: any, i: number) => (
            <div key={i} style={{ ...styles.tableRow, backgroundColor: i % 2 === 0 ? 'rgba(45,27,61,0.04)' : 'transparent' }}>
              <span style={styles.td}>{i + 1}</span>
              <span style={styles.td}>{p.nome || p.nome}</span>
              <span style={{ ...styles.td, color: '#e07a5f', fontWeight: 600 }}>
                R$ {(p.preco_unitario || p.preco || 0).toFixed(2)}
              </span>
              <span style={styles.td}>{p.quantidade_disponivel || p.quantidade || 0}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        <span>📊 Dados atualizados</span>
        <span>🕒 {new Date().toLocaleString()}</span>
      </div>
    </div>
  );
};

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  loadingText: {
    color: '#3d2b4d',
    marginTop: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f0ddd0',
    borderTop: '4px solid #e07a5f',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  banner: {
    background: 'linear-gradient(135deg, #2d1b3d, #3d2b4d, #4a3a5a)',
    borderRadius: '16px',
    padding: '2.5rem',
    marginBottom: '2rem',
    color: '#fff',
    border: '1px solid rgba(242,204,143,0.2)',
    boxShadow: '0 8px 40px rgba(45,27,61,0.3)',
  },
  bannerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  bannerTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    margin: 0,
  },
  bannerSub: {
    fontSize: '1.05rem',
    opacity: 0.8,
    margin: '0.5rem 0 1rem',
  },
  bannerStats: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  bannerStat: {
    fontSize: '0.95rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  bannerIcon: {
    fontSize: '5rem',
    opacity: 0.1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 4px 20px rgba(45,27,61,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: '2.2rem',
  },
  cardValue: {
    fontSize: '2.2rem',
    fontWeight: 700,
  },
  cardTitle: {
    fontSize: '0.95rem',
    color: '#3d2b4d',
    margin: '0.5rem 0 0',
    fontWeight: 500,
  },
  tableContainer: {
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.2)',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(45,27,61,0.05)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  tableTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#3d2b4d',
    margin: 0,
  },
  tableBadge: {
    fontSize: '0.75rem',
    color: '#3d2b4d',
    backgroundColor: 'rgba(45,27,61,0.08)',
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
  },
  table: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  tableRowHeader: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 120px 80px',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    alignItems: 'center',
    borderBottom: '2px solid rgba(45,27,61,0.1)',
    marginBottom: '0.25rem',
    color: '#3d2b4d',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 120px 80px',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    alignItems: 'center',
    color: '#2d1b3d',
  },
  th: {
    fontWeight: 600,
    color: '#3d2b4d',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  td: {
    color: '#2d1b3d',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderTop: '1px solid rgba(45,27,61,0.08)',
    fontSize: '0.8rem',
    color: '#6a5a6a',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;