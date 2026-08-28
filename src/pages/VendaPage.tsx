import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

interface Venda {
  id_venda?: number;
  id_movimentacao: number;
  preco_unitario_praticado: number;
  quantidade: number;
  valor_total: number;
  produto_nome?: string;
  data?: string;
}

interface Movimentacao {
  id_movimentacao: number;
  id_produto: number;
  quantidade: number;
  produto_nome?: string;
}

const VendaPage: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id_movimentacao: 0,
    preco_unitario_praticado: 0,
    quantidade: 0,
    valor_total: 0,
  });

  const loadData = async () => {
    try {
      const [vendasRes, movRes] = await Promise.all([
        api.get('/vendas'),
        api.get('/movimentacoes'),
      ]);
      setVendas(vendasRes.data || []);
      const movs = (movRes.data || []).filter((m: any) => m.tipo === 'RETIRADA' && m.motivo === 'VENDA');
      setMovimentacoes(movs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id_movimentacao === 0 || formData.quantidade <= 0 || formData.preco_unitario_praticado <= 0) {
      alert('Preencha todos os campos!');
      return;
    }
    const total = formData.preco_unitario_praticado * formData.quantidade;
    if (Math.abs(formData.valor_total - total) > 0.01) {
      alert(`Valor total incorreto. Esperado: R$ ${total.toFixed(2)}`);
      return;
    }
    try {
      await api.post('/vendas', formData);
      alert('Venda registrada!');
      setShowForm(false);
      setFormData({ id_movimentacao: 0, preco_unitario_praticado: 0, quantidade: 0, valor_total: 0 });
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao registrar venda');
    }
  };

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>💰 Vendas</h1>
        <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '➕ Nova Venda'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>📝 Nova Venda</h2>
          <select
            required
            value={formData.id_movimentacao}
            onChange={(e) => setFormData({ ...formData, id_movimentacao: parseInt(e.target.value) })}
            style={styles.select}
          >
            <option value={0}>Selecione uma movimentação...</option>
            {movimentacoes.map((m) => (
              <option key={m.id_movimentacao} value={m.id_movimentacao}>
                {m.produto_nome || `Produto #${m.id_produto}`} - {m.quantidade} unidades
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            required
            placeholder="Preço Unitário Praticado"
            value={formData.preco_unitario_praticado || ''}
            onChange={(e) => {
              const valor = parseFloat(e.target.value) || 0;
              setFormData({ ...formData, preco_unitario_praticado: valor, valor_total: valor * formData.quantidade });
            }}
            style={styles.input}
          />
          <input
            type="number"
            required
            min="1"
            placeholder="Quantidade"
            value={formData.quantidade || ''}
            onChange={(e) => {
              const qtd = parseInt(e.target.value) || 0;
              setFormData({ ...formData, quantidade: qtd, valor_total: formData.preco_unitario_praticado * qtd });
            }}
            style={styles.input}
          />
          <input
            type="number"
            step="0.01"
            required
            placeholder="Valor Total"
            value={formData.valor_total || ''}
            onChange={(e) => setFormData({ ...formData, valor_total: parseFloat(e.target.value) || 0 })}
            style={styles.input}
          />
          <button type="submit" style={styles.btnPrimary}>Registrar Venda</button>
        </form>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Preço Unitário</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((v) => (
              <tr key={v.id_venda}>
                <td>{v.id_venda}</td>
                <td>{v.produto_nome || 'N/A'}</td>
                <td>R$ {v.preco_unitario_praticado.toFixed(2)}</td>
                <td>{v.quantidade}</td>
                <td>R$ {v.valor_total.toFixed(2)}</td>
                <td>{v.data ? new Date(v.data).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {vendas.length === 0 && <p style={styles.empty}>Nenhuma venda registrada.</p>}
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
  empty: { textAlign: 'center' as const, padding: '2rem', color: '#999' },
};

export default VendaPage;