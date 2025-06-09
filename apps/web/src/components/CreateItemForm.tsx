// src/components/CreateItemForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useItemStore } from '@/store/itemStore';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().optional(),
});

type ItemFormValues = z.infer<typeof formSchema>;

// Basic styling (can be improved with Tailwind classes)
const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxWidth: '400px',
  padding: '1.5rem',
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #cbd5e1',
  borderRadius: '0.375rem',
  width: '100%',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#94a3b8',
  cursor: 'not-allowed',
};

const errorMessageStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '0.875rem',
};

export function CreateItemForm() {
  const { addItem } = useItemStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '' },
  });

  async function onSubmit(values: ItemFormValues) {
    setSubmitError(null);
    try {
      await addItem(values);
      alert("Item created successfully!"); // Simple feedback
      form.reset();
    } catch (error) {
      setSubmitError((error as Error).message || "Failed to create item.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} style={formStyle}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          style={inputStyle}
          placeholder="Item name"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p style={errorMessageStyle}>{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description">Description (Optional)</label>
        <input
          id="description"
          style={inputStyle}
          placeholder="Item description"
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p style={errorMessageStyle}>{form.formState.errors.description.message}</p>
        )}
      </div>

      {submitError && <p style={errorMessageStyle}>Error: {submitError}</p>}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        style={form.formState.isSubmitting ? disabledButtonStyle : buttonStyle}
      >
        {form.formState.isSubmitting ? 'Creating...' : 'Create Item'}
      </button>
    </form>
  );
}
