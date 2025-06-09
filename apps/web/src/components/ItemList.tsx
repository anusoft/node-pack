// src/components/ItemList.tsx
'use client';
import { useEffect } from 'react';
import { useItemStore } from '@/store/itemStore';

// Basic styling for the card-like div and table (can be improved with Tailwind classes)
const cardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
  padding: '1.5rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
};

const tdStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: '1px solid #e2e8f0',
};


export function ItemList() {
  const { items, isLoading, error, fetchItems } = useItemStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (isLoading && items.length === 0) return <p>Loading items...</p>;
  if (error) return <p style={{ color: 'red' }}>Error fetching items: {error}</p>;

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Items</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style{...thStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.id}</td>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && !isLoading && <p style={{ marginTop: '1rem' }}>No items found.</p>}
    </div>
  );
}
