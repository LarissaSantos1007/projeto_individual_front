import React from 'react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: '📊' },
    { id: 'produtos', label: 'Produtos', icon: '📦' },
    { id: 'reposicao', label: 'Reposição', icon: '🔄' },
    { id: 'cadastro', label: 'Cadastro', icon: '➕' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏪</span>
          <h1 style={styles.logoTitle}>Controle de Estoque</h1>
        </div>
        <div style={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                ...styles.navLink,
                ...(activePage === item.id ? styles.navLinkActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
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
  navContainer: {
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
  navLinks: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  navLink: {
    color: '#a0a0b0',
    background: 'transparent',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'inherit',
  },
  navLinkActive: {
    color: '#fff',
    background: 'rgba(74, 144, 217, 0.2)',
    boxShadow: '0 0 20px rgba(74, 144, 217, 0.1)',
  },
  navIcon: {
    fontSize: '1.1rem',
  },
};

export default Navbar;