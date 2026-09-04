import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: '📊 Início' },
    { id: 'categorias', label: '📂 Categorias' },
    { id: 'produtos', label: '📦 Produtos' },
    { id: 'movimentacoes', label: '🔄 Movimentações' },
    { id: 'vendas', label: '💰 Vendas' },
    { id: 'relatorios', label: '📈 Relatórios' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏪</span>
          <span style={styles.logoText}>Controle de Estoque</span>
        </div>
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
    background: 'linear-gradient(135deg, #2d1b69, #4a2a5a)',
    padding: '0 2rem',
    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    borderBottom: '2px solid rgba(253,121,168,0.3)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '1.8rem',
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#fd79a8',
  },
  tabs: {
    display: 'flex',
    gap: '0.25rem',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.2rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'transparent',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'inherit',
  },
  tabActive: {
    background: 'rgba(253,121,168,0.15)',
    color: '#fd79a8',
    boxShadow: '0 0 30px rgba(253,121,168,0.05)',
    border: '1px solid rgba(253,121,168,0.15)',
  },
};

export default Navbar;