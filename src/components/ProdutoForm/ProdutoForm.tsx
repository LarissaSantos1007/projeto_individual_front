import React, { useState, useEffect } from 'react';

interface ProdutoFormProps {
  onSubmit: (data: any) => void;
  produtoInicial?: any;
  isEditing?: boolean;
  onCancel?: () => void;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ onSubmit, produtoInicial, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    quantidadeEstoque: 0,
    categoria: 'OUTROS',
    ativo: true
  });

  useEffect(() => {
    if (produtoInicial && isEditing) {
      setFormData(produtoInicial);
    }
  }, [produtoInicial, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
      <h2>{isEditing ? 'Editar' : 'Novo'} Produto</h2>
      
      <div>
        <label>Nome</label>
        <input
          required
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </div>

      <div>
        <label>Descrição</label>
        <textarea
          required
          value={formData.descricao}
          onChange={(e) => setFormData({...formData, descricao: e.target.value})}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </div>

      <div>
        <label>Preço</label>
        <input
          type="number"
          required
          value={formData.preco}
          onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </div>

      <div>
        <label>Estoque</label>
        <input
          type="number"
          required
          value={formData.quantidadeEstoque}
          onChange={(e) => setFormData({...formData, quantidadeEstoque: parseInt(e.target.value) || 0})}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </div>

      <div>
        <label>Categoria</label>
        <select
          value={formData.categoria}
          onChange={(e) => setFormData({...formData, categoria: e.target.value})}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        >
          <option value="ELETRÔNICOS">Eletrônicos</option>
          <option value="ROUPAS">Roupas</option>
          <option value="ALIMENTOS">Alimentos</option>
          <option value="LIVROS">Livros</option>
          <option value="OUTROS">Outros</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.ativo}
            onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
          />
          Ativo
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
};

export default ProdutoForm;