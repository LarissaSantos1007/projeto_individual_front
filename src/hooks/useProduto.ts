import { useState, useEffect } from 'react';

export const useProduto = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProdutos([
        { id: 1, nome: 'Produto 1', descricao: 'Descrição 1', preco: 100, quantidadeEstoque: 10, categoria: 'ELETRÔNICOS', ativo: true },
        { id: 2, nome: 'Produto 2', descricao: 'Descrição 2', preco: 200, quantidadeEstoque: 5, categoria: 'ROUPAS', ativo: true }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const criarProduto = async (data: any) => {
    const novo = { ...data, id: Date.now() };
    setProdutos([...produtos, novo]);
    return novo;
  };

  const atualizarProduto = async (id: number, data: any) => {
    setProdutos(produtos.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletarProduto = async (id: number) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const carregarProdutos = async () => {
    setLoading(true);
    setTimeout(() => {
      setProdutos([
        { id: 1, nome: 'Produto 1', descricao: 'Descrição 1', preco: 100, quantidadeEstoque: 10, categoria: 'ELETRÔNICOS', ativo: true },
        { id: 2, nome: 'Produto 2', descricao: 'Descrição 2', preco: 200, quantidadeEstoque: 5, categoria: 'ROUPAS', ativo: true }
      ]);
      setLoading(false);
    }, 500);
  };

  return {
    produtos,
    loading,
    error,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    carregarProdutos
  };
};