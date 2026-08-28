import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

interface Movimentacao {
  id_movimentacao?: number;
  id_produto: number;
  tipo: 'ENTRADA' | 'RETIRADA';
  quantidade: number;
  data: string;
  observacao?: string;
  motivo: string;
  produto_nome?: string;
}

interface Produto {
  id_produto: number;
  nome: string;
}

const MovimentacaoPage: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id_produto: 0,
    tipo: 'ENTRADA' as 'ENTRADA' | 'RETIRADA',
    quantidade: 0,
    motivo: 'COMPRA' as string,
    observacao: '',
  });

  const loadData = async () => {
    try {
      const [movRes, prodRes] = await Promise.all([
        api.get('/movimentacoes'),
        api.get('/produtos'),
      ]);
      setMovimentacoes(movRes.data || []);
      setProdutos(prodRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id_produto === 0 || formData.quantidade <= 0) {
      alert('Preencha todos os campos!');
      return;
    }
    try {
      await api.post('/movimentacoes', {
        ...formData,
        data: new Date().toISOString(),
      });
      alert('Movimentação criada!');
      setShowForm(false);
      setFormData({ id_produto: 0, tipo: 'ENTRADA', quantidade: 0, motivo: 'COMPRA', observacao: '' });
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao criar movimentação');
    }
  };

  const getProdutoNome = (id: number) => {
    const p = produtos.find(p => p.id_produto === id);
    return p ? p.nome : 'N/A';
  };

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>🔄 Movimentações</h1>
        <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '➕ Nova Movimentação'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>📝 Nova Movimentação</h2>
          <select
            required
            value={formData.id_produto}
            onChange={(e) => setFormData({ ...formData, id_produto: parseInt(e.target.value) })}
            style={styles.select}
          >
            <option value={0}>Selecione um produto...</option>
            {produtos.map((p) => (
              <option key={p.id_produto} value={p.id_produto}>{p.nome}</option>
            ))}
          </select>
          <select
            required
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'ENTRADA' | 'RETIRADA' })}
            style={styles.select}
          >
            <option value="ENTRADA">📥 ENTRADA</option>
            <option value="RETIRADA">📤 RETIRADA</option>
          </select>
          <input
            type="number"
            required
            min="1"
            placeholder="Quantidade"
            value={formData.quantidade || ''}
            onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
            style={styles.input}
          />
          <select
            required
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            style={styles.select}
          >
            <option value="COMPRA">COMPRA</option>
            <option value="VENDA">VENDA</option>
            <option value="USO_INTERNO">USO INTERNO</option>
            <option value="DEVOLUCAO">DEVOLUÇÃO</option>
            <option value="PERDA">PERDA</option>
            <option value="AJUSTE">AJUSTE</option>
          </select>
          <input
            placeholder="Observação (opcional)"
            value={formData.observacao}
            onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
            style={styles.input}
          />
          <button type="submit" style={styles.btnPrimary}>Salvar Movimentação</button>
        </form>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Motivo</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((m) => (
              <tr key={m.id_movimentacao} style={m.tipo === 'ENTRADA' ? styles.rowEntrada : styles.rowSaida}>
                <td>{m.id_movimentacao}</td>
                <td>{m.produto_nome || getProdutoNome(m.id_produto)}</td>
                <td>{m.tipo === 'ENTRADA' ? '📥 ENTRADA' : '📤 RETIRADA'}</td>
                <td>{m.quantidade}</td>
                <td>{m.motivo}</td>
                <td>{new Date(m.data).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {movimentacoes.length === 0 && <p style={styles.empty}>Nenhuma movimentação registrada.</p>}
      </div>
    </div>
  );
};

const styles = {
  loading: { textAlign: 'center' as const, padding: '3rem', color: '#666' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '0.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#333', margin: 0 },
  btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  form: { backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  input: { width: '100%', padding: '0.7rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none' },
  select: { width: '100%', padding: '0.7rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none', backgroundColor: '#fff' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.9rem' },
  rowEntrada: { borderLeft: '4px solid #28a745' },
  rowSaida: { borderLeft: '4px solid #dc3545' },
  empty: { textAlign: 'center' as const, padding: '2rem', color: '#999' },
};

export default MovimentacaoPage;