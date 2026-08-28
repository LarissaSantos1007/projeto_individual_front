import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CategoriaPage from './pages/CategoriaPage';
import ProdutoPage from './pages/ProdutoPage';
import MovimentacaoPage from './pages/MovimentacaoPage';
import VendaPage from './pages/VendaPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'categorias':
        return <CategoriaPage />;
      case 'produtos':
        return <ProdutoPage />;
      case 'movimentacoes':
        return <MovimentacaoPage />;
      case 'vendas':
        return <VendaPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.app}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.main}>{renderPage()}</main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ marginTop: '60px' }}
      />
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0e1a, #1a1730)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
};

export default App;