'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SavedGraph, SavedGraphInput } from '@/types';

interface UseSavedGraphsResult {
  graphs: SavedGraph[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveGraph: (input: SavedGraphInput) => Promise<SavedGraph | null>;
  renameGraph: (id: string, name: string) => Promise<void>;
  deleteGraph: (id: string) => Promise<void>;
}

export function useSavedGraphs(): UseSavedGraphsResult {
  const [graphs, setGraphs] = useState<SavedGraph[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/graphs', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load saved graphs.');
      setGraphs(json.data as SavedGraph[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved graphs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveGraph = useCallback(
    async (input: SavedGraphInput) => {
      setError(null);
      try {
        const res = await fetch('/api/graphs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to save graph.');
        await refresh();
        return json.data as SavedGraph;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save graph.');
        return null;
      }
    },
    [refresh]
  );

  const renameGraph = useCallback(
    async (id: string, name: string) => {
      setError(null);
      try {
        const res = await fetch(`/api/graphs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to rename graph.');
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to rename graph.');
      }
    },
    [refresh]
  );

  const deleteGraph = useCallback(
    async (id: string) => {
      setError(null);
      try {
        const res = await fetch(`/api/graphs/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to delete graph.');
        setGraphs((prev) => prev.filter((g) => g._id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete graph.');
      }
    },
    []
  );

  return { graphs, loading, error, refresh, saveGraph, renameGraph, deleteGraph };
}
