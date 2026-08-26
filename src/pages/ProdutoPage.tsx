import React, { useState } from 'react';
import ProdutoCard from '../components/ProdutoCard';

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

interface ProdutosPageProps {
  produtos: Produto[];
  categorias: Categoria[];
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
  getCategoriaNome: (id: number) => string;
}

const ProdutosPage: React.FC<ProdutosPageProps> = ({ 
  produtos, 
  onEdit, 
  onDelete, 
  getCategoriaNome 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');

  const filteredProdutos = produtos.filter(produto => {
    const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'TODOS' || produto.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📦 Produtos</h1>
          <p style={styles.subtitle}>Gerencie todos os seus produtos</p>
        </div>
        <div style={styles.headerActions}>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.reloadBtn}
          >
            🔄 Atualizar
          </button>
          <span style={styles.total}>{produtos.length} produtos</span>
        </div>
      </div>

      <div style={styles.filters}>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="TODOS">Todos</option>
          <option value="ATIVO">Ativos</option>
          <option value="INATIVO">Inativos</option>
        </select>
      </div>

      <div style={styles.grid}>
        {filteredProdutos.map((produto) => (
          <ProdutoCard
            key={produto.id_produto}
            produto={produto}
            onEdit={onEdit}
            onDelete={onDelete}
            getCategoriaNome={getCategoriaNome}
          />
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📭</span>
          <p>Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#333',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#888',
    margin: '0.25rem 0 0',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
  },
  reloadBtn: {
    padding: '0.4rem 1rem',
    backgroundColor: '#6c5ce7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  total: {
    fontSize: '0.9rem',
    color: '#888',
    backgroundColor: '#e8ecf1',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontWeight: 500,
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  searchContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '0 1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid #e8ecf1',
    transition: 'all 0.3s ease',
    minWidth: '200px',
  },
  searchIcon: {
    fontSize: '1.1rem',
    color: '#999',
  },
  searchInput: {
    flex: 1,
    padding: '0.7rem 0.8rem',
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
    background: 'transparent',
    fontFamily: 'inherit',
  },
  filterSelect: {
    padding: '0.7rem 1.2rem',
    border: '2px solid #e8ecf1',
    borderRadius: '10px',
    fontSize: '0.95rem',
    backgroundColor: '#fff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem',
    color: '#999',
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
};

export default ProdutosPage;