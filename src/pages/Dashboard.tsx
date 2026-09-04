import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import SimpleChart from '../components/SimpleChart';

const DADOS_EXEMPLO = {
  produtos: [
    { id: 1, nome: 'Notebook Dell', preco: 3499.90, quantidade: 15 },
    { id: 2, nome: 'Smartphone Samsung', preco: 2499.00, quantidade: 8 },
    { id: 3, nome: 'Monitor LG', preco: 899.90, quantidade: 3 },
    { id: 4, nome: 'Teclado Mecânico', preco: 299.90, quantidade: 12 },
    { id: 5, nome: 'Mouse Gamer', preco: 149.90, quantidade: 1 },
    { id: 6, nome: 'Fone Bluetooth', preco: 199.90, quantidade: 25 },
    { id: 7, nome: 'Placa de Vídeo NVIDIA', preco: 2499.90, quantidade: 0 },
    { id: 8, nome: 'Processador Intel i7', preco: 2199.90, quantidade: 0 },
    { id: 9, nome: 'Fonte Corsair 500W', preco: 349.90, quantidade: 0 },
    { id: 10, nome: 'SSD Kingston 480GB', preco: 279.90, quantidade: 4 },
    { id: 11, nome: 'Memória RAM HyperX', preco: 399.90, quantidade: 2 },
    { id: 12, nome: 'Roteador TP-Link', preco: 199.90, quantidade: 6 },
  ],
  categorias: [
    { id: 1, nome: 'Hardware' },
    { id: 2, nome: 'Periféricos' },
    { id: 3, nome: 'Armazenamento' },
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
  const [loading, setLoading] = useState(false);
  const [ultimosProdutos, setUltimosProdutos] = useState(DADOS_EXEMPLO.produtos);
  const [salesLabels, setSalesLabels] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [movLabels, setMovLabels] = useState<string[]>(['ENTRADA','RETIRADA']);
  const [movData, setMovData] = useState<number[]>([0,0]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [produtosRes, categoriasRes] = await Promise.all([
          api.get('/produtos'),
          api.get('/categorias'),
          api.get('/vendas'),
          api.get('/movimentacoes'),
        ]);

        const dadosProdutos = produtosRes.data || DADOS_EXEMPLO.produtos;
        const dadosCategorias = categoriasRes.data || DADOS_EXEMPLO.categorias;
        const vendasRes = (await api.get('/vendas')).data || [];
        const movsRes = (await api.get('/movimentacoes')).data || [];

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
        setUltimosProdutos(dadosProdutos.slice(0, 8));

        // montar dados do gráfico de vendas (últimos 7 dias)
        const last7: string[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          last7.push(d.toLocaleDateString('pt-BR'));
        }
        const salesByDay = last7.map(day => {
          const sum = (vendasRes || []).filter((v: any) => v.data && new Date(v.data).toLocaleDateString('pt-BR') === day).reduce((s: number, v: any) => s + (v.valor_total || 0), 0);
          return sum;
        });
        setSalesLabels(last7);
        setSalesData(salesByDay);

        // movimentações por tipo
        const entradas = (movsRes || []).filter((m: any) => m.tipo === 'ENTRADA').reduce((s: number, m: any) => s + (m.quantidade || 0), 0);
        const retiradas = (movsRes || []).filter((m: any) => m.tipo === 'RETIRADA').reduce((s: number, m: any) => s + (m.quantidade || 0), 0);
        setMovData([entradas, retiradas]);
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
        // fallback chart data from exemplo
        const last7: string[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          last7.push(d.toLocaleDateString('pt-BR'));
        }
        setSalesLabels(last7);
        setSalesData([100,200,150,300,120,90,80]);
        setMovData([120,80]);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(loadStats, 100);
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
    { title: 'Produtos', value: stats.produtos, icon: '📦', color: '#6c5ce7' },
    { title: 'Categorias', value: stats.categorias, icon: '📂', color: '#fd79a8' },
    { title: 'Movimentações', value: stats.movimentacoes, icon: '🔄', color: '#a29bfe' },
    { title: 'Vendas', value: stats.vendas, icon: '💰', color: '#fd79a8' },
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

      <div style={{display:'grid', gridTemplateColumns: '1fr 360px', gap: '1rem', marginBottom: '1.5rem'}}>
        <div style={{background:'#120f20', padding:16, borderRadius:12}}>
          <h3 style={{marginTop:0}}>Vendas (últimos 7 dias)</h3>
          <SimpleChart data={salesData} labels={salesLabels} />
        </div>
        <div style={{background:'#120f20', padding:16, borderRadius:12}}>
          <h3 style={{marginTop:0}}>Movimentações</h3>
          <SimpleChart data={movData} labels={movLabels} />
        </div>
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
            <div key={i} style={{ ...styles.tableRow, backgroundColor: i % 2 === 0 ? 'rgba(253,121,168,0.05)' : 'transparent' }}>
              <span style={styles.td}>{i + 1}</span>
              <span style={styles.td}>{p.nome || p.nome}</span>
              <span style={{ ...styles.td, color: '#fd79a8', fontWeight: 600 }}>
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
    color: '#a29bfe',
    marginTop: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #2d1b69',
    borderTop: '4px solid #fd79a8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  banner: {
    background: 'linear-gradient(135deg, #1a1730, #2d1b69, #3d2b8a)',
    borderRadius: '16px',
    padding: '2.5rem',
    marginBottom: '2rem',
    color: '#fff',
    border: '1px solid rgba(253,121,168,0.15)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
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
    opacity: 0.7,
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
    opacity: 0.08,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.05)',
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
    color: '#a0a0b8',
    margin: '0.5rem 0 0',
    fontWeight: 500,
  },
  tableContainer: {
    background: '#120f20',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(253,121,168,0.08)',
    marginBottom: '1.5rem',
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
    color: '#d0d0e0',
    margin: 0,
  },
  tableBadge: {
    fontSize: '0.75rem',
    color: '#fd79a8',
    backgroundColor: 'rgba(253,121,168,0.1)',
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
    borderBottom: '1px solid rgba(253,121,168,0.1)',
    marginBottom: '0.25rem',
    color: '#8888a0',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 120px 80px',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    alignItems: 'center',
    color: '#b0b0c8',
  },
  th: {
    fontWeight: 600,
    color: '#8888a0',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  td: {
    color: '#b0b0c8',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderTop: '1px solid rgba(253,121,168,0.08)',
    fontSize: '0.8rem',
    color: '#666680',
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