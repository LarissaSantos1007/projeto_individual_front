import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    produtos: 0,
    categorias: 0,
    movimentacoes: 0,
    vendas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [produtos, categorias, movimentacoes, vendas] = await Promise.all([
          api.get('/produtos'),
          api.get('/categorias'),
          api.get('/movimentacoes'),
          api.get('/vendas'),
        ]);
        setStats({
          produtos: produtos.data?.length || 0,
          categorias: categorias.data?.length || 0,
          movimentacoes: movimentacoes.data?.length || 0,
          vendas: vendas.data?.length || 0,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  const cards = [
    { title: '📦 Produtos', value: stats.produtos, color: '#4a90d9' },
    { title: '📂 Categorias', value: stats.categorias, color: '#28a745' },
    { title: '🔄 Movimentações', value: stats.movimentacoes, color: '#ffc107' },
    { title: '💰 Vendas', value: stats.vendas, color: '#6c5ce7' },
  ];

  return (
    <div>
      <h1 style={styles.title}>📊 Dashboard</h1>
      <p style={styles.subtitle}>Visão geral do sistema</p>
      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.title} style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
            <span style={styles.cardValue}>{card.value}</span>
            <p style={styles.cardTitle}>{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  loading: { textAlign: 'center' as const, padding: '3rem', color: '#666' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#333', margin: 0 },
  subtitle: { fontSize: '1rem', color: '#888', margin: '0.25rem 0 1.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center' as const,
  },
  cardValue: { fontSize: '2.5rem', fontWeight: 700, color: '#333', display: 'block' },
  cardTitle: { fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0' },
};

export default Dashboard;