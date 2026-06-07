import { useState, useEffect } from 'react';
import type { Category } from '../types';
import { dbService } from '../services/db';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await dbService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return { categories, loading, error };
}
