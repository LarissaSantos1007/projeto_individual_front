import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import SimpleChart from '../components/SimpleChart';
import { toCSV, downloadCSV } from '../utils/exportCsv';

const RelatoriosPage: React.FC = () => {
  const [vendas, setVendas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vRes, pRes] = await Promise.all([api.get('/vendas'), api.get('/produtos')]);
      setVendas(vRes.data || []);
      setProdutos(pRes.data || []);
    } catch (err) {
      console.log('Erro ao carregar relatórios, usando dados locais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(loadData, 100);
  }, []);

  const filterVendasPeriodo = () => {
    if (!startDate && !endDate) return vendas;
    return vendas.filter(v => {
      if (!v.data) return false;
      const d = new Date(v.data);
      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate)) return false;
      return true;
    });
  };

  const vendasFiltradas = filterVendasPeriodo();

  const vendasPorDia = () => {
    const map = new Map<string, number>();
    vendasFiltradas.forEach(v => {
      const key = v.data ? new Date(v.data).toLocaleDateString('pt-BR') : 'Sem data';
      map.set(key, (map.get(key) || 0) + (v.valor_total || 0));
    });
    const labels = Array.from(map.keys());
    const data = Array.from(map.values());
    return { labels, data };
  };

  const lowStockProducts = produtos.filter(p => (p.quantidade_disponivel || 0) <= (p.quantidade_minima || 0));

  const exportVendas = () => {
    const csv = toCSV(vendasFiltradas, ['id_venda', 'produto_nome', 'quantidade', 'preco_unitario_praticado', 'valor_total', 'data']);
    downloadCSV(`vendas_${startDate || 'all'}_${endDate || 'all'}.csv`, csv);
  };

  const exportLowStock = () => {
    const csv = toCSV(lowStockProducts, ['id_produto', 'nome', 'quantidade_disponivel', 'quantidade_minima']);
    downloadCSV('produtos_estoque_baixo.csv', csv);
  };

  if (loading) return <div style={{padding: '2rem'}}>Carregando relatórios...</div>;

  const { labels, data } = vendasPorDia();

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <div>
          <h1 style={{margin:0}}>📈 Relatórios</h1>
          <p style={{color:'#888', margin: '4px 0 0'}}>Vendas por período e produtos com estoque baixo</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{padding:8}} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{padding:8}} />
          <button onClick={exportVendas} style={{padding:'8px 12px'}}>📤 Exportar Vendas</button>
          <button onClick={exportLowStock} style={{padding:'8px 12px'}}>📤 Exportar Estoque Baixo</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: '1fr 360px', gap:16}}>
        <div style={{background:'#120f20', padding:16, borderRadius:12}}>
          <h3 style={{marginTop:0}}>Vendas por dia</h3>
          {data.length === 0 ? <p style={{color:'#888'}}>Nenhuma venda no período selecionado.</p> : <SimpleChart data={data} labels={labels} />}
          <div style={{marginTop:12}}>
            <strong>Total:</strong> R$ {vendasFiltradas.reduce((s, v) => s + (v.valor_total || 0), 0).toFixed(2)}
          </div>
        </div>

        <div style={{background:'#120f20', padding:16, borderRadius:12}}>
          <h3 style={{marginTop:0}}>Produtos com estoque baixo</h3>
          {lowStockProducts.length === 0 ? <p style={{color:'#888'}}>Nenhum produto com estoque baixo.</p> : (
            <ul>
              {lowStockProducts.map((p: any) => (
                <li key={p.id_produto}>{p.nome} — {p.quantidade_disponivel} (mín: {p.quantidade_minima})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;
