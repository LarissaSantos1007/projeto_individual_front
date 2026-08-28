import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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

const VENDAS_EXEMPLO: Venda[] = [
  { id_venda: 1, id_movimentacao: 11, preco_unitario_praticado: 3499.90, quantidade: 2, valor_total: 6999.80, produto_nome: 'Notebook Dell', data: new Date(Date.now() - 86400000 * 27).toISOString() },
  { id_venda: 2, id_movimentacao: 12, preco_unitario_praticado: 2499.00, quantidade: 1, valor_total: 2499.00, produto_nome: 'Smartphone Samsung', data: new Date(Date.now() - 86400000 * 24).toISOString() },
  { id_venda: 3, id_movimentacao: 13, preco_unitario_praticado: 299.90, quantidade: 3, valor_total: 899.70, produto_nome: 'Teclado Mecânico', data: new Date(Date.now() - 86400000 * 21).toISOString() },
  { id_venda: 4, id_movimentacao: 14, preco_unitario_praticado: 149.90, quantidade: 5, valor_total: 749.50, produto_nome: 'Mouse Gamer', data: new Date(Date.now() - 86400000 * 18).toISOString() },
  { id_venda: 5, id_movimentacao: 15, preco_unitario_praticado: 899.90, quantidade: 2, valor_total: 1799.80, produto_nome: 'Monitor LG', data: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id_venda: 6, id_movimentacao: 16, preco_unitario_praticado: 279.90, quantidade: 3, valor_total: 839.70, produto_nome: 'SSD Kingston', data: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id_venda: 7, id_movimentacao: 17, preco_unitario_praticado: 199.90, quantidade: 2, valor_total: 399.80, produto_nome: 'Roteador TP-Link', data: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id_venda: 8, id_movimentacao: 11, preco_unitario_praticado: 3499.90, quantidade: 1, valor_total: 3499.90, produto_nome: 'Notebook Dell', data: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id_venda: 9, id_movimentacao: 14, preco_unitario_praticado: 149.90, quantidade: 3, valor_total: 449.70, produto_nome: 'Mouse Gamer', data: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id_venda: 10, id_movimentacao: 12, preco_unitario_praticado: 2499.00, quantidade: 2, valor_total: 4998.00, produto_nome: 'Smartphone Samsung', data: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id_venda: 11, id_movimentacao: 15, preco_unitario_praticado: 899.90, quantidade: 1, valor_total: 899.90, produto_nome: 'Monitor LG', data: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id_venda: 12, id_movimentacao: 13, preco_unitario_praticado: 299.90, quantidade: 2, valor_total: 599.80, produto_nome: 'Teclado Mecânico', data: new Date(Date.now() - 86400000 * 1).toISOString() },
];

const MOVIMENTACOES_EXEMPLO: Movimentacao[] = [
  { id_movimentacao: 11, id_produto: 1, quantidade: 2, produto_nome: 'Notebook Dell' },
  { id_movimentacao: 12, id_produto: 2, quantidade: 1, produto_nome: 'Smartphone Samsung' },
  { id_movimentacao: 13, id_produto: 4, quantidade: 3, produto_nome: 'Teclado Mecânico' },
  { id_movimentacao: 14, id_produto: 5, quantidade: 5, produto_nome: 'Mouse Gamer' },
  { id_movimentacao: 15, id_produto: 3, quantidade: 2, produto_nome: 'Monitor LG' },
  { id_movimentacao: 16, id_produto: 8, quantidade: 3, produto_nome: 'SSD Kingston' },
  { id_movimentacao: 17, id_produto: 11, quantidade: 2, produto_nome: 'Roteador TP-Link' },
];

const VendaPage: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>(VENDAS_EXEMPLO);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(MOVIMENTACOES_EXEMPLO);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (vendasRes.data && vendasRes.data.length > 0) {
        setVendas(vendasRes.data);
      }
      const movs = (movRes.data || []).filter((m: any) => m.tipo === 'RETIRADA' && m.motivo === 'VENDA');
      if (movs.length > 0) {
        setMovimentacoes(movs);
      }
    } catch (error) {
      console.log('Usando dados de exemplo');
    }
  };

  useEffect(() => {
    setTimeout(loadData, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id_movimentacao === 0 || formData.quantidade <= 0 || formData.preco_unitario_praticado <= 0) {
      toast.error('Preencha todos os campos!');
      return;
    }
    const total = formData.preco_unitario_praticado * formData.quantidade;
    if (Math.abs(formData.valor_total - total) > 0.01) {
      toast.error(`Valor total incorreto. Esperado: R$ ${total.toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);

    const mov = movimentacoes.find(m => m.id_movimentacao === formData.id_movimentacao);
    const novaVenda: Venda = {
      id_venda: vendas.length + 1, // ← ID SEQUENCIAL
      id_movimentacao: formData.id_movimentacao,
      preco_unitario_praticado: formData.preco_unitario_praticado,
      quantidade: formData.quantidade,
      valor_total: formData.valor_total,
      produto_nome: mov?.produto_nome || 'N/A',
      data: new Date().toISOString(),
    };
    setVendas([...vendas, novaVenda]);
    toast.success('Venda registrada! 💰');

    setShowForm(false);
    setFormData({ id_movimentacao: 0, preco_unitario_praticado: 0, quantidade: 0, valor_total: 0 });
    setIsSubmitting(false);

    try {
      await api.post('/vendas', formData);
      await loadData();
    } catch (error) {
      console.log('Não sincronizado');
    }
  };

  const filteredVendas = vendas.filter(v =>
    v.produto_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id_venda?.toString().includes(searchTerm)
  );

  const totalVendas = filteredVendas.reduce((sum, v) => sum + v.valor_total, 0);

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💰 Vendas</h1>
          <p style={styles.subtitle}>{vendas.length} vendas registradas</p>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.headerBadge}>💰 Total: R$ {totalVendas.toFixed(2)}</span>
          <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancelar' : '➕ Nova Venda'}
          </button>
        </div>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Buscar venda por produto ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.searchResult}>{filteredVendas.length} resultados</span>
      </div>

      <div style={styles.resumo}>
        <div style={styles.resumoCard}>
          <span style={styles.resumoIcon}>💰</span>
          <div>
            <span style={styles.resumoValor}>R$ {totalVendas.toFixed(2)}</span>
            <span style={styles.resumoLabel}>Total em Vendas</span>
          </div>
        </div>
        <div style={styles.resumoCard}>
          <span style={styles.resumoIcon}>📦</span>
          <div>
            <span style={styles.resumoValor}>{filteredVendas.length}</span>
            <span style={styles.resumoLabel}>Total de Vendas</span>
          </div>
        </div>
        <div style={styles.resumoCard}>
          <span style={styles.resumoIcon}>📊</span>
          <div>
            <span style={styles.resumoValor}>{filteredVendas.reduce((sum, v) => sum + v.quantidade, 0)}</span>
            <span style={styles.resumoLabel}>Itens Vendidos</span>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>📝 Nova Venda</h2>
          <select required value={formData.id_movimentacao} onChange={(e) => setFormData({ ...formData, id_movimentacao: parseInt(e.target.value) })} style={styles.select}>
            <option value={0}>Selecione uma movimentação...</option>
            {movimentacoes.map((m) => (
              <option key={m.id_movimentacao} value={m.id_movimentacao}>
                {m.produto_nome || `Produto #${m.id_produto}`} - {m.quantidade} unidades
              </option>
            ))}
          </select>
          <input type="number" step="0.01" required placeholder="Preço Unitário Praticado" value={formData.preco_unitario_praticado || ''} onChange={(e) => {
            const valor = parseFloat(e.target.value) || 0;
            setFormData({ ...formData, preco_unitario_praticado: valor, valor_total: valor * formData.quantidade });
          }} style={styles.input} />
          <input type="number" required min="1" placeholder="Quantidade" value={formData.quantidade || ''} onChange={(e) => {
            const qtd = parseInt(e.target.value) || 0;
            setFormData({ ...formData, quantidade: qtd, valor_total: formData.preco_unitario_praticado * qtd });
          }} style={styles.input} />
          <input type="number" step="0.01" required placeholder="Valor Total" value={formData.valor_total || ''} onChange={(e) => setFormData({ ...formData, valor_total: parseFloat(e.target.value) || 0 })} style={styles.input} />
          <button type="submit" style={styles.btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Registrar Venda'}
          </button>
        </form>
      )}

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>📋 Histórico de Vendas</h3>
          <span style={styles.tableBadge}>{filteredVendas.length} vendas</span>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Produto</th>
              <th style={styles.th}>Preço Unitário</th>
              <th style={styles.th}>Quantidade</th>
              <th style={styles.th}>Valor Total</th>
              <th style={styles.th}>Data</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendas.map((v) => (
              <tr key={v.id_venda}>
                <td style={styles.td}>{v.id_venda}</td>
                <td style={styles.td}><strong>{v.produto_nome || 'N/A'}</strong></td>
                <td style={styles.td}>R$ {v.preco_unitario_praticado.toFixed(2)}</td>
                <td style={styles.td}>{v.quantidade}</td>
                <td style={{ ...styles.td, color: '#6c5ce7', fontWeight: 700 }}>R$ {v.valor_total.toFixed(2)}</td>
                <td style={styles.td}>{v.data ? new Date(v.data).toLocaleDateString('pt-BR') : '-'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={styles.footerRow}>
              <td style={styles.footerText} colSpan={4}>TOTAL:</td>
              <td style={styles.footerTotal}>R$ {totalVendas.toFixed(2)}</td>
              <td style={styles.td}></td>
            </tr>
          </tfoot>
        </table>
        {filteredVendas.length === 0 && <p style={styles.empty}>Nenhuma venda encontrada.</p>}
      </div>
    </div>
  );
};

const styles = {
  loading: { textAlign: 'center' as const, padding: '3rem', color: '#a29bfe' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '0.5rem' },
  subtitle: { fontSize: '0.9rem', color: '#8888a0', margin: '0.25rem 0 0' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const },
  headerBadge: { fontSize: '1rem', color: '#a29bfe', fontWeight: 600, backgroundColor: 'rgba(108,92,231,0.1)', padding: '0.3rem 1rem', borderRadius: '20px' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#d0d0e0', margin: 0 },
  btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  searchBar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' as const },
  searchInput: { flex: 1, padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', minWidth: '200px', background: '#1a1730', color: '#d0d0e0' },
  searchResult: { fontSize: '0.85rem', color: '#8888a0' },
  resumo: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  resumoCard: { background: '#1a1730', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' },
  resumoIcon: { fontSize: '2.2rem' },
  resumoValor: { fontSize: '1.8rem', fontWeight: 700, color: '#d0d0e0', display: 'block' },
  resumoLabel: { fontSize: '0.9rem', color: '#8888a0' },
  form: { background: '#1a1730', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(108,92,231,0.1)' },
  input: { width: '100%', padding: '0.7rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  select: { width: '100%', padding: '0.7rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  tableContainer: { background: '#120f20', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' as const },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' },
  tableTitle: { fontSize: '1.1rem', fontWeight: 600, color: '#d0d0e0', margin: 0 },
  tableBadge: { fontSize: '0.9rem', color: '#a29bfe', backgroundColor: 'rgba(108,92,231,0.1)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '1rem' },
  th: { fontSize: '1rem', fontWeight: 700, color: '#8888a0', padding: '0.75rem 0.5rem', textAlign: 'left' as const, borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { fontSize: '1rem', padding: '0.6rem 0.5rem', color: '#b0b0c8' },
  footerRow: { borderTop: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' },
  footerText: { textAlign: 'right' as const, padding: '0.6rem 0.5rem', color: '#b0b0c8' },
  footerTotal: { color: '#6c5ce7', fontWeight: 700, padding: '0.6rem 0.5rem' },
  empty: { textAlign: 'center' as const, padding: '2rem', color: '#8888a0' },
};

export default VendaPage;