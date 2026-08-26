import React from 'react';

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

interface ReposicaoPageProps {
  produtos: Produto[];
  getCategoriaNome: (id: number) => string;
}

const ReposicaoPage: React.FC<ReposicaoPageProps> = ({ produtos, getCategoriaNome }) => {
  const reposicaoNecessaria = produtos.filter(p => p.quantidade_disponivel <= p.quantidade_minima && p.status === 'ATIVO');
  const comEstoqueOk = produtos.filter(p => p.quantidade_disponivel > p.quantidade_minima && p.status === 'ATIVO');

  const calcularNecessidade = (produto: Produto) => {
    return produto.quantidade_minima - produto.quantidade_disponivel;
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔄 Reposição de Estoque</h1>
          <p style={styles.subtitle}>Controle de produtos com estoque baixo</p>
        </div>
        <div style={styles.headerStats}>
          <span style={{...styles.badge, backgroundColor: '#dc3545', color: '#fff'}}>
            ⚠️ {reposicaoNecessaria.length} precisam repor
          </span>
          <span style={{...styles.badge, backgroundColor: '#28a745', color: '#fff'}}>
            ✅ {comEstoqueOk.length} com estoque ok
          </span>
        </div>
      </div>

      {reposicaoNecessaria.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🎉</span>
          <p style={styles.emptyTitle}>Tudo em ordem!</p>
          <p style={styles.emptySub}>Nenhum produto com estoque baixo.</p>
        </div>
      ) : (
        <>
          <h2 style={styles.sectionTitle}>🔴 Produtos com Estoque Baixo</h2>
          <div style={styles.grid}>
            {reposicaoNecessaria.map((produto) => (
              <div key={produto.id_produto} style={styles.cardAlert}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{produto.nome}</h3>
                    <span style={styles.cardCode}>#{produto.codigo}</span>
                  </div>
                  <span style={styles.statusDanger}>⚠️ Baixo</span>
                </div>
                <p style={styles.cardDesc}>{produto.descricao || 'Sem descrição'}</p>
                <div style={styles.cardDetails}>
                  <div><strong>Categoria:</strong> {getCategoriaNome(produto.id_categoria)}</div>
                  <div style={styles.detailRow}>
                    <span><strong>Atual:</strong> {produto.quantidade_disponivel}</span>
                    <span><strong>Mínimo:</strong> {produto.quantidade_minima}</span>
                  </div>
                  <div style={styles.needAlert}>
                    <span style={styles.needIcon}>📦</span>
                    <span style={styles.needText}>
                      <strong>Necessário repor:</strong> {calcularNecessidade(produto)} unidades
                    </span>
                  </div>
                </div>
                <div style={styles.progressContainer}>
                  <div style={{
                    ...styles.progressBar,
                    width: `${Math.min((produto.quantidade_disponivel / produto.quantidade_minima) * 100, 100)}%`,
                    backgroundColor: '#dc3545',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {comEstoqueOk.length > 0 && (
        <>
          <h2 style={{...styles.sectionTitle, marginTop: '2rem' }}>🟢 Produtos com Estoque OK</h2>
          <div style={styles.grid}>
            {comEstoqueOk.slice(0, 4).map((produto) => (
              <div key={produto.id_produto} style={styles.cardOk}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{produto.nome}</h3>
                    <span style={styles.cardCode}>#{produto.codigo}</span>
                  </div>
                  <span style={styles.statusOk}>✅ OK</span>
                </div>
                <p style={styles.cardDesc}>{produto.descricao || 'Sem descrição'}</p>
                <div style={styles.cardDetails}>
                  <div><strong>Categoria:</strong> {getCategoriaNome(produto.id_categoria)}</div>
                  <div style={styles.detailRow}>
                    <span><strong>Atual:</strong> {produto.quantidade_disponivel}</span>
                    <span><strong>Mínimo:</strong> {produto.quantidade_minima}</span>
                  </div>
                </div>
                <div style={styles.progressContainer}>
                  <div style={{
                    ...styles.progressBar,
                    width: `${Math.min((produto.quantidade_disponivel / produto.quantidade_minima) * 100, 100)}%`,
                    backgroundColor: '#28a745',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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
  headerStats: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
  },
  badge: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#333',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  cardAlert: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid #dc3545',
    transition: 'all 0.3s ease',
  },
  cardOk: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e8ecf1',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  cardCode: {
    fontSize: '0.8rem',
    color: '#999',
  },
  statusDanger: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontWeight: 600,
  },
  statusOk: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontWeight: 600,
  },
  cardDesc: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  needAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    marginTop: '0.25rem',
  },
  needIcon: {
    fontSize: '1rem',
  },
  needText: {
    fontSize: '0.9rem',
  },
  progressContainer: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e8ecf1',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '0.75rem',
  },
  progressBar: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  emptyIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  emptySub: {
    fontSize: '1rem',
    color: '#888',
    margin: '0.25rem 0 0',
  },
};

export default ReposicaoPage;