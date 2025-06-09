// src/app/page.tsx
import { CreateItemForm } from '@/components/CreateItemForm';
import { ItemList } from '@/components/ItemList';

// Basic container styling
const containerStyle: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '1rem',
  fontFamily: 'sans-serif',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '2rem',
};

const headingStyle: React.CSSProperties = {
  fontSize: '1.5rem', // text-2xl
  fontWeight: 'bold', // font-bold
  marginBottom: '1rem',
};

const subHeadingStyle: React.CSSProperties = {
  fontSize: '1.25rem', // text-xl
  fontWeight: '600', // font-semibold
  marginBottom: '0.5rem',
};

export default function HomePage() {
  return (
    <main style={containerStyle}>
      <h1 style={headingStyle}>Item Management</h1>

      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>Create New Item</h2>
        <CreateItemForm />
      </div>

      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>Existing Items</h2>
        <ItemList />
      </div>
    </main>
  );
}
