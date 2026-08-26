import React, { useState, useEffect } from 'react';

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

interface CadastroPageProps {
  onCadastrar: (produto: any) => void;
  categorias: Categoria[];
  editing: Produto | null;
  setEditing: (produto: Produto | null) => void;
}

const CadastroPage: React.FC<CadastroPageProps> = ({ onCadastrar, categorias, editing, setEditing }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    id_categoria: 0,
    preco_unitario: 0,
    quantidade_disponivel: 0,
    quantidade_minima: 0,
    status: 'ATIVO' as 'ATIVO' | 'INATIVO',
  });

  useEffect(() => {
    if (editing) {
      setFormData({
        codigo: editing.codigo,
        nome: editing.nome,
        descricao: editing.descricao || '',
        id_categoria: editing.id_categoria,
        preco_unitario: editing.preco_unitario,
        quantidade_disponivel: editing.quantidade_disponivel,
        quantidade_minima: editing.quantidade_minima,
        status: editing.status,
      });
    } else {
      setFormData({
        codigo: '',
        nome: '',
        descricao: '',
        id_categoria: 0,
        preco_unitario: 0,
        quantidade_disponivel: 0,
        quantidade_minima: 0,
        status: 'ATIVO',
      });
    }
  }, [editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.codigo.trim()) {
      alert('Código é obrigatório!');
      return;
    }
    if (!formData.nome.trim()) {
      alert('Nome é obrigatório!');
      return;
    }
    if (formData.id_categoria === 0) {
      alert('Selecione uma categoria!');
      return;
    }
    if (formData.preco_unitario <= 0) {
      alert('Preço deve ser maior que zero!');
      return;
    }
    if (formData.quantidade_disponivel < 0) {
      alert('Quantidade não pode ser negativa!');
      return;
    }
    if (formData.quantidade_minima < 0) {
      alert('Quantidade mínima não pode ser negativa!');
      return;
    }

    onCadastrar(formData);
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      id_categoria: 0,
      preco_unitario: 0,
      quantidade_disponivel: 0,
      quantidade_minima: 0,
      status: 'ATIVO',
    });
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{editing ? '✏️ Editar Produto' : '➕ Cadastrar Produto'}</h1>
          <p style={styles.subtitle}>{editing ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar um novo produto'}</p>
        </div>
        {editing && (
          <button 
            style={styles.btnCancel}
            onClick={() => { setEditing(null); }}
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formRow2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Código *</label>
            <input
              required
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              style={styles.input}
              placeholder="Ex: PROD-001"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome *</label>
            <input
              required
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              style={styles.input}
              placeholder="Nome do produto"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Descrição</label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            style={styles.textarea}
            placeholder="Descrição do produto"
            rows={3}
          />
        </div>

        <div style={styles.formRow2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Categoria *</label>
            <select
              required
              value={formData.id_categoria}
              onChange={(e) => setFormData({...formData, id_categoria: parseInt(e.target.value)})}
              style={styles.select}
            >
              <option value={0}>Selecione...</option>
              {categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'ATIVO' | 'INATIVO'})}
              style={styles.select}
            >
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>
        </div>

        <div style={styles.formRow2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Preço Unitário (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={formData.preco_unitario || ''}
              onChange={(e) => setFormData({...formData, preco_unitario: parseFloat(e.target.value) || 0})}
              style={styles.input}
              placeholder="0,00"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Quantidade Disponível *</label>
            <input
              type="number"
              min="0"
              required
              value={formData.quantidade_disponivel}
              onChange={(e) => setFormData({...formData, quantidade_disponivel: parseInt(e.target.value) || 0})}
              style={styles.input}
              placeholder="0"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Quantidade Mínima *</label>
          <input
            type="number"
            min="0"
            required
            value={formData.quantidade_minima}
            onChange={(e) => setFormData({...formData, quantidade_minima: parseInt(e.target.value) || 0})}
            style={styles.input}
            placeholder="0"
          />
        </div>

        <button type="submit" style={styles.btnSubmit}>
          {editing ? '💾 Atualizar Produto' : '📦 Cadastrar Produto'}
        </button>
      </form>
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
  btnCancel: {
    padding: '0.6rem 1.5rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  formRow2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
    marginBottom: '0.25rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 600,
    color: '#555',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  select: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
  },
  btnSubmit: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
};

export default CadastroPage;