import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 style={styles.title}>📊 Dashboard</h1>
      <div style={styles.card}>
        <p style={styles.text}>Bem-vindo ao Sistema de Controle de Estoque!</p>
        <p style={styles.subtext}>Gerencie seus produtos, categorias e movimentações.</p>
      </div>
    </div>
  );
};

const styles = {
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#333',
    marginBottom: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center' as const,
  },
  text: {
    fontSize: '1.2rem',
    color: '#333',
    margin: 0,
  },
  subtext: {
    fontSize: '1rem',
    color: '#666',
    marginTop: '0.5rem',
  },
};

export default Dashboard;