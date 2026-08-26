import React from 'react';
import ProdutoPage from './pages/ProdutoPage';

function App() {
  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <h1 style={styles.logo}>📦 Controle de Estoque</h1>
          <div style={styles.navLinks}>
            <span style={styles.navLink}>Produtos</span>
          </div>
        </div>
      </nav>
      <div style={styles.content}>
        <ProdutoPage />
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  nav: {
    backgroundColor: '#1a1a2e',
    padding: '0 2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
  },
  logo: {
    color: '#fff',
    fontSize: '1.25rem',
    margin: 0,
    fontWeight: 700,
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  navLink: {
    color: '#e0e0e0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
};

export default App;