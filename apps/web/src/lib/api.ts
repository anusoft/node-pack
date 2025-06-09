// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Ensure NEXT_PUBLIC_API_URL is in .env.local

export interface Item {
  id: number;
  name: string;
  description?: string;
}

export async function getItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE_URL}/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function createItem(data: { name: string; description?: string }): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    // Try to parse error message from backend
    let errorDetails = 'Failed to create item';
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorDetails = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
      }
    } catch (e) {
      // Ignore if error response is not JSON
    }
    throw new Error(errorDetails);
  }
  return res.json();
}
// Add updateItem and deleteItem later if needed for UI
