import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'produtos', label: '📦 Produtos' },
    { id: 'categorias', label: '📂 Categorias' },
    { id: 'movimentacoes', label: '🔄 Movimentações' },
    { id: 'vendas', label: '💰 Vendas' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <h1 style={styles.logo}>🏪 Controle de Estoque</h1>
        <div style={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#1a1a2e',
    padding: '0 2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    borderBottom: '3px solid #4a90d9',
  },
  container: {
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
    color: '#fff',
    fontSize: '1.3rem',
    margin: 0,
    fontWeight: 700,
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  tab: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'transparent',
    color: '#a0a0b0',
    fontFamily: 'inherit',
  },
  tabActive: {
    background: '#4a90d9',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(74,144,217,0.3)',
  },
};

export default Navbar;