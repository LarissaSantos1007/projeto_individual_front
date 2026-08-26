import React from 'react';

interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoria: string;
  ativo: boolean;
}

interface ProdutoItemProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
}

const ProdutoItem: React.FC<ProdutoItemProps> = ({ produto, onEdit, onDelete }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>{produto.nome}</h3>
      <p>{produto.descricao}</p>
      <p>Preço: R$ {produto.preco}</p>
      <p>Estoque: {produto.quantidadeEstoque}</p>
      <button onClick={() => onEdit(produto)}>Editar</button>
      <button onClick={() => onDelete(produto.id!)}>Excluir</button>
    </div>
  );
};

export default ProdutoItem;