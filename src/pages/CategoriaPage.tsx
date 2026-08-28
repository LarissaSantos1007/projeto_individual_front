import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

interface Categoria {
  id_categoria?: number;
  nome: string;
  descricao?: string;
}

const CATEGORIAS_EXEMPLO: Categoria[] = [
  { id_categoria: 1, nome: 'Hardware', descricao: 'Componentes físicos de computadores' },
  { id_categoria: 2, nome: 'Software', descricao: 'Programas e sistemas operacionais' },
  { id_categoria: 3, nome: 'Redes', descricao: 'Equipamentos e configurações de rede' },
  { id_categoria: 4, nome: 'Periféricos', descricao: 'Mouse, teclado, monitor, impressora' },
  { id_categoria: 5, nome: 'Armazenamento', descricao: 'HD, SSD, pendrive, cartão de memória' },
  { id_categoria: 6, nome: 'Processadores', descricao: 'CPU Intel, AMD e processadores' },
  { id_categoria: 7, nome: 'Memórias', descricao: 'RAM, ROM, cache e memória flash' },
  { id_categoria: 8, nome: 'Placas Mãe', descricao: 'Motherboards para computadores' },
  { id_categoria: 9, nome: 'Fontes de Alimentação', descricao: 'Fontes ATX, módulos de energia' },
  { id_categoria: 10, nome: 'Gabinetes', descricao: 'Gabinetes para computadores e servidores' },
  { id_categoria: 11, nome: 'Monitores', descricao: 'Telas LED, LCD, OLED e touch screen' },
  { id_categoria: 12, nome: 'Impressoras', descricao: 'Impressoras matriciais, laser, jato de tinta' },
  { id_categoria: 13, nome: 'Scanners', descricao: 'Scanners de documentos e imagens' },
  { id_categoria: 14, nome: 'Webcams', descricao: 'Câmeras para videoconferência' },
  { id_categoria: 15, nome: 'Headphones', descricao: 'Fones de ouvido e headsets' },
  { id_categoria: 16, nome: 'Caixas de Som', descricao: 'Sistemas de áudio para computadores' },
  { id_categoria: 17, nome: 'Roteadores', descricao: 'Roteadores Wi-Fi e equipamentos de rede' },
  { id_categoria: 18, nome: 'Switches', descricao: 'Switches de rede para empresas' },
  { id_categoria: 19, nome: 'Cabos', descricao: 'Cabos HDMI, USB, Ethernet, VGA' },
  { id_categoria: 20, nome: 'Adaptadores', descricao: 'Adaptadores USB, HDMI, VGA, DVI' },
  { id_categoria: 21, nome: 'Tablets', descricao: 'Tablets e acessórios' },
  { id_categoria: 22, nome: 'Smartphones', descricao: 'Telefones celulares e acessórios' },
  { id_categoria: 23, nome: 'Carregadores', descricao: 'Carregadores de bateria, cabos USB' },
  { id_categoria: 24, nome: 'Baterias', descricao: 'Baterias para notebooks e dispositivos' },
  { id_categoria: 25, nome: 'Coolers', descricao: 'Ventoinhas e sistemas de refrigeração' },
  { id_categoria: 26, nome: 'Placas de Vídeo', descricao: 'Placas gráficas para computadores' },
  { id_categoria: 27, nome: 'Placas de Som', descricao: 'Placas de áudio para computadores' },
  { id_categoria: 28, nome: 'Leitores de Cartão', descricao: 'Leitores de cartão SD, microSD' },
  { id_categoria: 29, nome: 'Hubs USB', descricao: 'Hubs e expansores USB' },
  { id_categoria: 30, nome: 'Servidores', descricao: 'Servidores e equipamentos de rack' },
];

const CategoriaPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_EXEMPLO);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      const res = await api.get('/categorias');
      if (res.data && res.data.length > 0) {
        setCategorias(res.data);
      }
    } catch (error) {
      console.log('Usando dados de exemplo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      alert('Nome é obrigatório!');
      return;
    }
    try {
      if (editing) {
        await api.put(`/categorias/${editing.id_categoria}`, formData);
        alert('Categoria atualizada!');
      } else {
        await api.post('/categorias', formData);
        alert('Categoria criada!');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ nome: '', descricao: '' });
      await loadData();
    } catch (error) {
      if (editing) {
        setCategorias(categorias.map(c => c.id_categoria === editing.id_categoria ? { ...formData, id_categoria: editing.id_categoria } : c));
        alert('Categoria atualizada localmente!');
      } else {
        const nova = { ...formData, id_categoria: Date.now() };
        setCategorias([...categorias, nova]);
        alert('Categoria criada localmente!');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ nome: '', descricao: '' });
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditing(categoria);
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza?')) {
      try {
        await api.delete(`/categorias/${id}`);
        alert('Categoria excluída!');
        await loadData();
      } catch (error) {
        setCategorias(categorias.filter(c => c.id_categoria !== id));
        alert('Categoria excluída localmente!');
      }
    }
  };

  const filteredCategorias = categorias.filter(cat =>
    cat.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.descricao && cat.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📂 Categorias</h1>
          <p style={styles.subtitle}>{categorias.length} categorias cadastradas</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => { setShowForm(true); setEditing(null); setFormData({ nome: '', descricao: '' }); }}>
          ➕ Nova Categoria
        </button>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Buscar categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.searchResult}>{filteredCategorias.length} resultados</span>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>{editing ? '✏️ Editar Categoria' : '📝 Nova Categoria'}</h2>
          <input
            required
            placeholder="Nome da categoria"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Descrição da categoria"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            style={styles.input}
          />
          <div style={styles.formActions}>
            <button type="button" style={styles.btnSecondary} onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</button>
            <button type="submit" style={styles.btnPrimary}>{editing ? 'Atualizar' : 'Cadastrar'}</button>
          </div>
        </form>
      )}

      <div style={styles.grid}>
        {filteredCategorias.map((cat) => (
          <div key={cat.id_categoria} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>{cat.nome}</h3>
                <span style={styles.cardId}>#{cat.id_categoria}</span>
              </div>
              <div>
                <button style={styles.btnEdit} onClick={() => handleEdit(cat)}>✏️</button>
                <button style={styles.btnDelete} onClick={() => handleDelete(cat.id_categoria!)}>🗑️</button>
              </div>
            </div>
            <p style={styles.cardDesc}>{cat.descricao || 'Sem descrição'}</p>
          </div>
        ))}
      </div>
      {filteredCategorias.length === 0 && (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>📭</span>
          <p>Nenhuma categoria encontrada</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  loading: { textAlign: 'center' as const, padding: '3rem', color: '#a29bfe' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '0.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#d0d0e0', margin: 0 },
  subtitle: { fontSize: '0.9rem', color: '#8888a0', margin: '0.25rem 0 0' },
  searchBar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' as const },
  searchInput: { flex: 1, padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', minWidth: '200px', background: '#1a1730', color: '#d0d0e0' },
  searchResult: { fontSize: '0.85rem', color: '#8888a0' },
  btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' },
  btnSecondary: { padding: '0.6rem 1.5rem', backgroundColor: '#2d1b69', color: '#a29bfe', border: '1px solid rgba(108,92,231,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  btnEdit: { padding: '0.25rem 0.6rem', backgroundColor: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem' },
  btnDelete: { padding: '0.25rem 0.6rem', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { background: '#1a1730', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(108,92,231,0.1)' },
  formTitle: { fontSize: '1.3rem', fontWeight: 600, color: '#d0d0e0', marginTop: 0, marginBottom: '1rem' },
  input: { width: '100%', padding: '0.7rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem', outline: 'none', background: '#120f20', color: '#d0d0e0' },
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' },
  card: { background: '#1a1730', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 600, color: '#d0d0e0', margin: 0 },
  cardId: { fontSize: '0.7rem', color: '#666680' },
  cardDesc: { color: '#8888a0', fontSize: '0.9rem', margin: '0.5rem 0 0' },
  empty: { textAlign: 'center' as const, padding: '3rem', color: '#8888a0' },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '0.5rem' },
};

export default CategoriaPage;