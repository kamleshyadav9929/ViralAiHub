import { useState, useEffect, useCallback } from 'react';
import type { Trend, Step, Prompt, Article } from '../types';
import { dbService } from '../services/db';

export function useTrends(filters?: {
  categorySlug?: string;
  search?: string;
  tool?: string;
  difficulty?: string;
  featuredOnly?: boolean;
  limit?: number;
}) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dbService.getTrends(filters);
      setTrends(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trends'));
    } finally {
      setLoading(false);
    }
  }, [
    filters?.categorySlug,
    filters?.search,
    filters?.tool,
    filters?.difficulty,
    filters?.featuredOnly,
    filters?.limit
  ]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return { trends, loading, error, refetch: fetchTrends };
}

export function useTrendDetail(slug: string | undefined) {
  const [trend, setTrend] = useState<Trend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrendDetail = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const data = await dbService.getTrendBySlug(slug);
      setTrend(data);
      if (data) {
        // Track the view asynchronously
        dbService.incrementViewCount(data.id);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trend details'));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchTrendDetail();
  }, [fetchTrendDetail]);

  return { trend, loading, error, refetch: fetchTrendDetail };
}

export function useTrendActions() {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<Error | null>(null);

  const createTrend = async (trendData: Partial<Trend> & {
    steps: Partial<Step>[];
    prompts: Partial<Prompt>[];
    youtubeVideoId?: string;
    articles: Partial<Article>[];
  }) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const result = await dbService.createTrend(trendData);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to create trend');
      setActionError(errorObj);
      throw errorObj;
    } finally {
      setActionLoading(false);
    }
  };

  const updateTrend = async (id: string, trendData: Partial<Trend> & {
    steps: Partial<Step>[];
    prompts: Partial<Prompt>[];
    youtubeVideoId?: string;
    articles: Partial<Article>[];
  }) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await dbService.updateTrend(id, trendData);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to update trend');
      setActionError(errorObj);
      throw errorObj;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTrend = async (id: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await dbService.deleteTrend(id);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to delete trend');
      setActionError(errorObj);
      throw errorObj;
    } finally {
      setActionLoading(false);
    }
  };

  return { createTrend, updateTrend, deleteTrend, actionLoading, actionError };
}
