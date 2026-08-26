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

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
  getCategoriaNome: (id: number) => string;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, onEdit, onDelete, getCategoriaNome }) => {
  const isEstoqueBaixo = produto.quantidade_disponivel <= produto.quantidade_minima;

  return (
    <div style={{
      ...styles.card,
      opacity: produto.status === 'ATIVO' ? 1 : 0.6,
      border: isEstoqueBaixo ? '2px solid #ffc107' : '1px solid #e8ecf1',
    }}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>{produto.nome}</h3>
          <span style={styles.cardCode}>#{produto.codigo}</span>
        </div>
        <div style={styles.badgeContainer}>
          {isEstoqueBaixo && <span style={styles.badgeWarning}>⚠️</span>}
          <span style={{
            ...styles.badge,
            backgroundColor: produto.status === 'ATIVO' ? '#d4edda' : '#f8d7da',
            color: produto.status === 'ATIVO' ? '#155724' : '#721c24',
          }}>
            {produto.status}
          </span>
        </div>
      </div>
      <p style={styles.cardDesc}>{produto.descricao || 'Sem descrição'}</p>
      <div style={styles.cardDetails}>
        <div><strong>Categoria:</strong> {getCategoriaNome(produto.id_categoria)}</div>
        <div style={styles.detailRow}>
          <span><strong>Preço:</strong> R$ {produto.preco_unitario.toFixed(2)}</span>
          <span><strong>Estoque:</strong> {produto.quantidade_disponivel}</span>
        </div>
      </div>
      <div style={styles.cardActions}>
        <button style={styles.btnEdit} onClick={() => onEdit(produto)}>✏️ Editar</button>
        <button style={styles.btnDelete} onClick={() => onDelete(produto.id_produto!)}>🗑️ Excluir</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  cardCode: {
    fontSize: '0.8rem',
    color: '#999',
  },
  badgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  badgeWarning: {
    fontSize: '1.1rem',
  },
  badge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  cardDesc: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  btnEdit: {
    flex: 1,
    padding: '0.4rem 0.8rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnDelete: {
    flex: 1,
    padding: '0.4rem 0.8rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default ProdutoCard;