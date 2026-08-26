import React from 'react';

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

interface DashboardProps {
  produtos: Produto[];
}

const Dashboard: React.FC<DashboardProps> = ({ produtos }) => {
  const totalProdutos = produtos.length;
  const ativos = produtos.filter(p => p.status === 'ATIVO').length;
  const inativos = produtos.filter(p => p.status === 'INATIVO').length;
  const baixoEstoque = produtos.filter(p => p.quantidade_disponivel <= p.quantidade_minima).length;
  const valorTotalEstoque = produtos.reduce((sum, p) => sum + (p.preco_unitario * p.quantidade_disponivel), 0);

  const cards = [
    { 
      title: 'Total de Produtos', 
      value: totalProdutos, 
      icon: '📦', 
      color: '#4a90d9',
      bg: 'rgba(74, 144, 217, 0.1)'
    },
    { 
      title: 'Ativos', 
      value: ativos, 
      icon: '✅', 
      color: '#28a745',
      bg: 'rgba(40, 167, 69, 0.1)'
    },
    { 
      title: 'Inativos', 
      value: inativos, 
      icon: '⛔', 
      color: '#dc3545',
      bg: 'rgba(220, 53, 69, 0.1)'
    },
    { 
      title: '⚠️ Estoque Baixo', 
      value: baixoEstoque, 
      icon: '🔔', 
      color: '#ffc107',
      bg: 'rgba(255, 193, 7, 0.1)'
    },
    { 
      title: '💰 Valor Total', 
      value: `R$ ${valorTotalEstoque.toFixed(2)}`, 
      icon: '💵', 
      color: '#6c5ce7',
      bg: 'rgba(108, 92, 231, 0.1)'
    },
  ];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Visão Geral</h1>
        <p style={styles.subtitle}>Visão geral do seu estoque</p>
      </div>

      <div style={styles.grid}>
        {cards.map((card, index) => (
          <div key={index} style={{...styles.card, borderTop: `4px solid ${card.color}`, backgroundColor: card.bg}}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>{card.icon}</span>
              <span style={{...styles.cardValue, color: card.color}}>{card.value}</span>
            </div>
            <p style={styles.cardTitle}>{card.title}</p>
          </div>
        ))}
      </div>

      {baixoEstoque > 0 && (
        <div style={styles.alert}>
          <span style={styles.alertIcon}>⚠️</span>
          <span style={styles.alertText}>
            <strong>{baixoEstoque} produtos</strong> estão com estoque abaixo do mínimo!
          </span>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#333',
    margin: 0,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#888',
    margin: '0.25rem 0 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  card: {
    borderRadius: '16px',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
  alert: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  alertIcon: {
    fontSize: '1.5rem',
  },
  alertText: {
    fontSize: '1rem',
    color: '#856404',
  },
};

export default Dashboard;