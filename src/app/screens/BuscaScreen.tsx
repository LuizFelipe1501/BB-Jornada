"use client";
import { useState } from 'react';
import { Search } from 'lucide-react';

const categorias = [
  { icon: '🏠', label: 'Financiamento', sub: 'Imóvel, veículo' },
  { icon: '💳', label: 'Cartões', sub: 'Crédito, débito' },
  { icon: '📈', label: 'Investimentos', sub: 'CDB, fundos, tesouro' },
  { icon: '🛡️', label: 'Seguros', sub: 'Vida, auto, residencial' },
  { icon: '📱', label: 'BB Digital', sub: 'App, internet banking' },
  { icon: '🎯', label: 'Minha Jornada', sub: 'Metas e objetivos' },
];

const recentes = [
  'CDB Banco do Brasil',
  'Tesouro Direto',
  'Poupança rendimento',
  'Limite crédito',
];

export default function BuscaScreen() {
  const [query, setQuery] = useState('');

  return (
    <div className="scrollable" style={{ flex: 1, padding: 16 }}>
      {/* Search input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#F5F5F5',
        borderRadius: 12,
        padding: '12px 14px',
        marginBottom: 24,
      }}>
        <Search size={18} color="#9E9E9E" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar no App BB..."
          style={{
            border: 'none', background: 'none', flex: 1,
            fontSize: 15, outline: 'none', fontFamily: 'inherit',
            color: '#1A1A1A',
          }}
          autoFocus
        />
      </div>

      {!query && (
        <>
          <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 15 }}>Categorias</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {categorias.map(c => (
              <div key={c.label} style={{
                background: '#F0F4FF',
                borderRadius: 12,
                padding: '14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{c.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 15 }}>Buscas recentes</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentes.map(r => (
              <div key={r} onClick={() => setQuery(r)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid #F0F0F0',
                cursor: 'pointer',
              }}>
                <Search size={16} color="#BDBDBD" />
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>{r}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {query && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ fontWeight: 700, color: '#0033A0', fontSize: 16 }}>Buscando &quot;{query}&quot;</p>
          <p style={{ color: '#6B6B6B', fontSize: 14 }}>Resultados aparecerão aqui</p>
        </div>
      )}
    </div>
  );
}
