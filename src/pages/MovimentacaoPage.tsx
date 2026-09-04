import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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

const MOVIMENTACOES_EXEMPLO: Movimentacao[] = [
  { id_movimentacao: 1, id_produto: 1, tipo: 'ENTRADA', quantidade: 10, data: new Date(Date.now() - 86400000 * 30).toISOString(), observacao: 'Compra de notebooks', motivo: 'COMPRA', produto_nome: 'Notebook Dell' },
  { id_movimentacao: 2, id_produto: 2, tipo: 'ENTRADA', quantidade: 5, data: new Date(Date.now() - 86400000 * 28).toISOString(), observacao: 'Novo lote', motivo: 'COMPRA', produto_nome: 'Smartphone Samsung' },
  { id_movimentacao: 3, id_produto: 3, tipo: 'ENTRADA', quantidade: 8, data: new Date(Date.now() - 86400000 * 25).toISOString(), observacao: 'Monitores LG', motivo: 'COMPRA', produto_nome: 'Monitor LG' },
  { id_movimentacao: 4, id_produto: 4, tipo: 'ENTRADA', quantidade: 15, data: new Date(Date.now() - 86400000 * 22).toISOString(), observacao: 'Teclados mecânicos', motivo: 'COMPRA', produto_nome: 'Teclado Mecânico' },
  { id_movimentacao: 5, id_produto: 5, tipo: 'ENTRADA', quantidade: 20, data: new Date(Date.now() - 86400000 * 20).toISOString(), observacao: 'Mouses gamer', motivo: 'COMPRA', produto_nome: 'Mouse Gamer' },
  { id_movimentacao: 6, id_produto: 6, tipo: 'ENTRADA', quantidade: 4, data: new Date(Date.now() - 86400000 * 18).toISOString(), observacao: 'Placas mãe ASUS', motivo: 'COMPRA', produto_nome: 'Placa Mãe ASUS' },
  { id_movimentacao: 7, id_produto: 7, tipo: 'ENTRADA', quantidade: 6, data: new Date(Date.now() - 86400000 * 15).toISOString(), observacao: 'Fontes Corsair', motivo: 'COMPRA', produto_nome: 'Fonte Corsair' },
  { id_movimentacao: 8, id_produto: 8, tipo: 'ENTRADA', quantidade: 10, data: new Date(Date.now() - 86400000 * 12).toISOString(), observacao: 'SSDs Kingston', motivo: 'COMPRA', produto_nome: 'SSD Kingston' },
  { id_movimentacao: 9, id_produto: 9, tipo: 'ENTRADA', quantidade: 8, data: new Date(Date.now() - 86400000 * 10).toISOString(), observacao: 'Memórias RAM HyperX', motivo: 'COMPRA', produto_nome: 'Memória RAM' },
  { id_movimentacao: 10, id_produto: 11, tipo: 'ENTRADA', quantidade: 12, data: new Date(Date.now() - 86400000 * 8).toISOString(), observacao: 'Roteadores TP-Link', motivo: 'COMPRA', produto_nome: 'Roteador TP-Link' },
  { id_movimentacao: 11, id_produto: 1, tipo: 'RETIRADA', quantidade: 2, data: new Date(Date.now() - 86400000 * 27).toISOString(), observacao: 'Venda de notebooks', motivo: 'VENDA', produto_nome: 'Notebook Dell' },
  { id_movimentacao: 12, id_produto: 2, tipo: 'RETIRADA', quantidade: 1, data: new Date(Date.now() - 86400000 * 24).toISOString(), observacao: 'Venda de smartphone', motivo: 'VENDA', produto_nome: 'Smartphone Samsung' },
  { id_movimentacao: 13, id_produto: 4, tipo: 'RETIRADA', quantidade: 3, data: new Date(Date.now() - 86400000 * 21).toISOString(), observacao: 'Venda de teclados', motivo: 'VENDA', produto_nome: 'Teclado Mecânico' },
  { id_movimentacao: 14, id_produto: 5, tipo: 'RETIRADA', quantidade: 5, data: new Date(Date.now() - 86400000 * 18).toISOString(), observacao: 'Venda de mouses', motivo: 'VENDA', produto_nome: 'Mouse Gamer' },
  { id_movimentacao: 15, id_produto: 3, tipo: 'RETIRADA', quantidade: 2, data: new Date(Date.now() - 86400000 * 15).toISOString(), observacao: 'Venda de monitores', motivo: 'VENDA', produto_nome: 'Monitor LG' },
  { id_movimentacao: 16, id_produto: 8, tipo: 'RETIRADA', quantidade: 3, data: new Date(Date.now() - 86400000 * 12).toISOString(), observacao: 'Venda de SSDs', motivo: 'VENDA', produto_nome: 'SSD Kingston' },
  { id_movimentacao: 17, id_produto: 11, tipo: 'RETIRADA', quantidade: 2, data: new Date(Date.now() - 86400000 * 9).toISOString(), observacao: 'Venda de roteadores', motivo: 'VENDA', produto_nome: 'Roteador TP-Link' },
  { id_movimentacao: 18, id_produto: 12, tipo: 'ENTRADA', quantidade: 3, data: new Date(Date.now() - 86400000 * 4).toISOString(), observacao: 'Placas de vídeo RTX', motivo: 'COMPRA', produto_nome: 'Placa de Vídeo NVIDIA' },
  { id_movimentacao: 19, id_produto: 13, tipo: 'ENTRADA', quantidade: 5, data: new Date(Date.now() - 86400000 * 2).toISOString(), observacao: 'Processadores Intel', motivo: 'COMPRA', produto_nome: 'Processador Intel' },
  { id_movimentacao: 20, id_produto: 2, tipo: 'ENTRADA', quantidade: 45, data: new Date(Date.now() - 86400000 * 0).toISOString(), observacao: 'Novo lote de smartphones', motivo: 'COMPRA', produto_nome: 'Smartphone Samsung' },
];

const PRODUTOS_EXEMPLO: Produto[] = [
  { id_produto: 1, nome: 'Notebook Dell' },
  { id_produto: 2, nome: 'Smartphone Samsung' },
  { id_produto: 3, nome: 'Monitor LG' },
  { id_produto: 4, nome: 'Teclado Mecânico' },
  { id_produto: 5, nome: 'Mouse Gamer' },
  { id_produto: 6, nome: 'Placa Mãe ASUS' },
  { id_produto: 7, nome: 'Fonte Corsair' },
  { id_produto: 8, nome: 'SSD Kingston' },
  { id_produto: 9, nome: 'Memória RAM' },
  { id_produto: 11, nome: 'Roteador TP-Link' },
  { id_produto: 12, nome: 'Placa de Vídeo NVIDIA' },
  { id_produto: 13, nome: 'Processador Intel' },
];

const MovimentacaoPage: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(MOVIMENTACOES_EXEMPLO);
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_EXEMPLO);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      if (movRes.data && movRes.data.length > 0) {
        const sorted = [...movRes.data].sort((a, b) => (a.id_movimentacao || 0) - (b.id_movimentacao || 0));
        setMovimentacoes(sorted);
      }
      if (prodRes.data && prodRes.data.length > 0) {
        setProdutos(prodRes.data);
      }
    } catch (error) {
      console.log('Usando dados de exemplo');
    }
  };

  useEffect(() => {
    setTimeout(loadData, 100);
  }, []);

  // ===== VALIDAÇÕES =====
  const validarCampos = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (formData.id_produto === 0) {
      newErrors.id_produto = 'Selecione um produto!';
      isValid = false;
    }

    if (formData.quantidade <= 0) {
      newErrors.quantidade = 'Quantidade deve ser maior que zero!';
      isValid = false;
    } else if (!Number.isInteger(formData.quantidade)) {
      newErrors.quantidade = 'Quantidade deve ser um número inteiro!';
      isValid = false;
    } else if (formData.quantidade > 100) {
      newErrors.quantidade = 'Quantidade não pode ser maior que 100!';
      isValid = false;
    }

    if (!formData.motivo) {
      newErrors.motivo = 'Motivo é obrigatório!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarCampos()) {
      toast.error('Corrija os erros antes de continuar!');
      return;
    }

    setIsSubmitting(true);

    const produto = produtos.find(p => p.id_produto === formData.id_produto);
    const novoId = movimentacoes.length > 0 ? Math.max(...movimentacoes.map(m => m.id_movimentacao || 0)) + 1 : 1;
    const novaMov = {
      id_movimentacao: novoId,
      id_produto: formData.id_produto,
      tipo: formData.tipo,
      quantidade: formData.quantidade,
      data: new Date().toISOString(),
      observacao: formData.observacao || '',
      motivo: formData.motivo,
      produto_nome: produto?.nome || 'N/A',
    };
    const novasMovimentacoes = [...movimentacoes, novaMov].sort((a, b) => (a.id_movimentacao || 0) - (b.id_movimentacao || 0));
    setMovimentacoes(novasMovimentacoes);
    toast.success('Movimentação criada! ✅');
    
    setShowForm(false);
    setFormData({ id_produto: 0, tipo: 'ENTRADA', quantidade: 0, motivo: 'COMPRA', observacao: '' });
    setErrors({});
    setIsSubmitting(false);

    try {
      await api.post('/movimentacoes', {
        ...formData,
        data: new Date().toISOString(),
      });
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ id_produto: 0, tipo: 'ENTRADA', quantidade: 0, motivo: 'COMPRA', observacao: '' });
    setErrors({});
  };

  const getProdutoNome = (id: number) => {
    const p = produtos.find(p => p.id_produto === id);
    return p ? p.nome : 'N/A';
  };

  const totalEntradas = movimentacoes.filter(m => m.tipo === 'ENTRADA').reduce((sum, m) => sum + m.quantidade, 0);
  const totalSaidas = movimentacoes.filter(m => m.tipo === 'RETIRADA').reduce((sum, m) => sum + m.quantidade, 0);

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>🔄 Movimentações</h1>
        <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '➕ Nova Movimentação'}
        </button>
      </div>

      <div style={styles.resumo}>
        <div style={styles.resumoCard}>
          <span style={styles.resumoIcon}>📥</span>
          <div>
            <span style={styles.resumoValor}>{totalEntradas}</span>
            <span style={styles.resumoLabel}>Total de Entradas</span>
          </div>
        </div>
        <div style={styles.resumoCard}>
          <span style={styles.resumoIcon}>📤</span>
          <div>
            <span style={styles.resumoValor}>{totalSaidas}</span>
            <span style={styles.resumoLabel}>Total de Saídas</span>
          </div>
        </div>
        <div style={styles.resumoCard}>
          <span style={styles.resumoIcon}>📊</span>
          <div>
            <span style={styles.resumoValor}>{movimentacoes.length}</span>
            <span style={styles.resumoLabel}>Total de Movimentações</span>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>📝 Nova Movimentação</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Produto *</label>
            <select
              required
              value={formData.id_produto}
              onChange={(e) => {
                setFormData({ ...formData, id_produto: parseInt(e.target.value) });
                if (errors.id_produto) setErrors({ ...errors, id_produto: '' });
              }}
              style={{ ...styles.select, ...(errors.id_produto ? styles.inputError : {}) }}
            >
              <option value={0}>Selecione um produto...</option>
              {produtos.map((p) => (
                <option key={p.id_produto} value={p.id_produto}>{p.nome}</option>
              ))}
            </select>
            {errors.id_produto && <span style={styles.errorText}>{errors.id_produto}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo *</label>
            <select
              required
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'ENTRADA' | 'RETIRADA' })}
              style={styles.select}
            >
              <option value="ENTRADA">📥 ENTRADA</option>
              <option value="RETIRADA">📤 RETIRADA</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Quantidade *</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              step="1"
              placeholder="Quantidade (máx 100)"
              value={formData.quantidade || ''}
              onChange={(e) => {
                const valor = parseInt(e.target.value) || 0;
                if (valor > 100) {
                  toast.error('Quantidade não pode ser maior que 100!');
                  setFormData({ ...formData, quantidade: 100 });
                  return;
                }
                setFormData({ ...formData, quantidade: valor });
                if (errors.quantidade) setErrors({ ...errors, quantidade: '' });
              }}
              style={{ ...styles.input, ...(errors.quantidade ? styles.inputError : {}) }}
            />
            {errors.quantidade && <span style={styles.errorText}>{errors.quantidade}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Motivo *</label>
            <select
              required
              value={formData.motivo}
              onChange={(e) => {
                setFormData({ ...formData, motivo: e.target.value });
                if (errors.motivo) setErrors({ ...errors, motivo: '' });
              }}
              style={{ ...styles.select, ...(errors.motivo ? styles.inputError : {}) }}
            >
              <option value="COMPRA">COMPRA</option>
              <option value="VENDA">VENDA</option>
              <option value="USO_INTERNO">USO INTERNO</option>
              <option value="DEVOLUCAO">DEVOLUÇÃO</option>
              <option value="PERDA">PERDA</option>
              <option value="AJUSTE">AJUSTE</option>
            </select>
            {errors.motivo && <span style={styles.errorText}>{errors.motivo}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Observação</label>
            <input
              placeholder="Observação (opcional)"
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formActions}>
            <button type="button" style={styles.btnSecondary} onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" style={styles.btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Movimentação'}
            </button>
          </div>
        </form>
      )}

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>📋 Histórico de Movimentações</h3>
          <span style={styles.tableBadge}>{movimentacoes.length} registros</span>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Produto</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Quantidade</th>
              <th style={styles.th}>Motivo</th>
              <th style={styles.th}>Data</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((m) => (
              <tr key={m.id_movimentacao} style={m.tipo === 'ENTRADA' ? styles.rowEntrada : styles.rowSaida}>
                <td style={styles.td}>{m.id_movimentacao}</td>
                <td style={styles.td}><strong>{m.produto_nome || getProdutoNome(m.id_produto)}</strong></td>
                <td style={styles.td}>{m.tipo === 'ENTRADA' ? '📥 ENTRADA' : '📤 RETIRADA'}</td>
                <td style={styles.td}><strong>{m.quantidade}</strong></td>
                <td style={styles.td}>{m.motivo}</td>
                <td style={styles.td}>{new Date(m.data).toLocaleDateString('pt-BR')}</td>
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
  loading: { textAlign: 'center' as const, padding: '3rem', color: '#a29bfe' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '0.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#d0d0e0', margin: 0 },
  btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  btnSecondary: { padding: '0.6rem 1.5rem', backgroundColor: '#2d1b69', color: '#a29bfe', border: '1px solid rgba(108,92,231,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  resumo: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  resumoCard: { background: '#1a1730', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' },
  resumoIcon: { fontSize: '2.2rem' },
  resumoValor: { fontSize: '1.8rem', fontWeight: 700, color: '#d0d0e0', display: 'block' },
  resumoLabel: { fontSize: '0.9rem', color: '#8888a0' },
  form: { background: '#1a1730', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(108,92,231,0.1)' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#a0a0b8', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.7rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  inputError: { borderColor: '#e74c3c', boxShadow: '0 0 0 2px rgba(231,76,60,0.1)' },
  errorText: { color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' },
  select: { width: '100%', padding: '0.7rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  tableContainer: { background: '#120f20', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' as const },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' },
  tableTitle: { fontSize: '1.1rem', fontWeight: 600, color: '#d0d0e0', margin: 0 },
  tableBadge: { fontSize: '0.9rem', color: '#a29bfe', backgroundColor: 'rgba(108,92,231,0.1)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '1rem' },
  th: { fontSize: '1rem', fontWeight: 700, color: '#8888a0', padding: '0.75rem 0.5rem', textAlign: 'left' as const, borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { fontSize: '1rem', padding: '0.6rem 0.5rem', color: '#b0b0c8' },
  rowEntrada: { borderLeft: '4px solid #28a745', background: 'rgba(40,167,69,0.05)' },
  rowSaida: { borderLeft: '4px solid #dc3545', background: 'rgba(220,53,69,0.05)' },
  empty: { textAlign: 'center' as const, padding: '2rem', color: '#8888a0' },
};

export default MovimentacaoPage;