import React from 'react';
import ProdutoItem from '../ProdutoItem/ProdutoItem';

interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoria: string;
  ativo: boolean;
}

interface ProdutoListProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
}

const ProdutoList: React.FC<ProdutoListProps> = ({ produtos, onEdit, onDelete }) => {
  if (produtos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
        <p>Nenhum produto cadastrado.</p>
        <p>Clique em "Novo Produto" para começar.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>Lista de Produtos ({produtos.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {produtos.map((produto) => (
          <ProdutoItem
            key={produto.id}
            produto={produto}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProdutoList;