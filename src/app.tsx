import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProdutosPage from './pages/ProdutoPage';
import ReposicaoPage from './pages/ReposicaoPage';
import CadastroPage from './pages/CadastroPage';
import { api } from './api/api';

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

interface Categoria {
  id_categoria: number;
  nome: string;
}

// DADOS INICIAIS
const PRODUTOS_INICIAIS: Produto[] = [
  { id_produto: 1, codigo: 'PROD-001', nome: 'Notebook Dell', descricao: '15.6 polegadas, 8GB RAM', id_categoria: 1, preco_unitario: 3499.90, quantidade_disponivel: 15, quantidade_minima: 5, status: 'ATIVO' },
  { id_produto: 2, codigo: 'PROD-002', nome: 'Smartphone Samsung', descricao: '6.5 polegadas, 128GB', id_categoria: 1, preco_unitario: 2499.00, quantidade_disponivel: 8, quantidade_minima: 3, status: 'ATIVO' },
  { id_produto: 3, codigo: 'PROD-003', nome: 'Camiseta Polo', descricao: 'Algodão 100%, tamanho G', id_categoria: 2, preco_unitario: 89.90, quantidade_disponivel: 50, quantidade_minima: 10, status: 'ATIVO' },
  { id_produto: 4, codigo: 'PROD-004', nome: 'Livro O Hobbit', descricao: 'Edição ilustrada, 320 páginas', id_categoria: 3, preco_unitario: 79.90, quantidade_disponivel: 2, quantidade_minima: 5, status: 'INATIVO' },
  { id_produto: 5, codigo: 'PROD-005', nome: 'Fone Bluetooth', descricao: 'Cancelamento de ruído, 20h', id_categoria: 1, preco_unitario: 199.90, quantidade_disponivel: 25, quantidade_minima: 8, status: 'ATIVO' },
  { id_produto: 6, codigo: 'PROD-006', nome: 'Monitor LG', descricao: '24 polegadas, Full HD', id_categoria: 1, preco_unitario: 899.90, quantidade_disponivel: 3, quantidade_minima: 6, status: 'ATIVO' },
  { id_produto: 7, codigo: 'PROD-007', nome: 'Teclado Mecânico', descricao: 'Switches blue, RGB', id_categoria: 1, preco_unitario: 299.90, quantidade_disponivel: 12, quantidade_minima: 4, status: 'ATIVO' },
  { id_produto: 8, codigo: 'PROD-008', nome: 'Mouse Gamer', descricao: '1600 DPI, 7 botões', id_categoria: 1, preco_unitario: 149.90, quantidade_disponivel: 1, quantidade_minima: 3, status: 'ATIVO' },
];

const CATEGORIAS_INICIAIS: Categoria[] = [
  { id_categoria: 1, nome: 'Eletrônicos' },
  { id_categoria: 2, nome: 'Roupas' },
  { id_categoria: 3, nome: 'Livros' },
];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_INICIAIS);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Produto | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [produtosRes, categoriasRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
      ]);
      if (produtosRes.data && produtosRes.data.length > 0) {
        setProdutos(produtosRes.data);
      }
      if (categoriasRes.data && categoriasRes.data.length > 0) {
        setCategorias(categoriasRes.data);
      }
    } catch (error) {
      console.log('Usando dados locais (backend não disponível)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoriaNome = (id: number) => {
    const categoria = categorias.find(c => c.id_categoria === id);
    return categoria ? categoria.nome : 'N/A';
  };

  const handleCadastrar = async (produtoData: any) => {
    try {
      await api.post('/produtos', produtoData);
      alert('Produto criado com sucesso!');
      await loadData();
      setCurrentPage('produtos');
      setEditing(null);
    } catch (error) {
      const novo = { ...produtoData, id_produto: Date.now() };
      setProdutos([...produtos, novo]);
      alert('Produto criado localmente!');
      setCurrentPage('produtos');
      setEditing(null);
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditing(produto);
    setCurrentPage('cadastro');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/produtos/${id}`);
        alert('Produto excluído com sucesso!');
        await loadData();
      } catch (error) {
        setProdutos(produtos.filter(p => p.id_produto !== id));
        alert('Produto excluído localmente!');
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard produtos={produtos} />;
      case 'produtos':
        return (
          <ProdutosPage
            produtos={produtos}
            categorias={categorias}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getCategoriaNome={getCategoriaNome}
          />
        );
      case 'reposicao':
        return <ReposicaoPage produtos={produtos} getCategoriaNome={getCategoriaNome} />;
      case 'cadastro':
        return (
          <CadastroPage
            onCadastrar={handleCadastrar}
            categorias={categorias}
            editing={editing}
            setEditing={setEditing}
          />
        );
      default:
        return <Dashboard produtos={produtos} />;
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Navbar activePage={currentPage} setActivePage={setCurrentPage} />
      <main style={styles.main}>{renderPage()}</main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #4a90d9',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#666',
    fontSize: '1.1rem',
  },
};

// Adiciona animação
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default App;