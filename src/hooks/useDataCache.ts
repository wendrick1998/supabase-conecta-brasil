
import { useState, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

type CacheOptions = {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum size of the cache
};

// Cache para dados compartilhados entre diferentes componentes
const globalCache = new Map<string, CacheItem<any>>();

/**
 * Hook para gerenciar cache de dados para reduzir chamadas redundantes ao banco de dados
 */
export function useDataCache<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Opções padrão
  const { ttl = 5 * 60 * 1000, maxSize = 50 } = options; // Padrão: 5 minutos, 50 itens

  // Função para limpar cache expirado
  const cleanupCache = () => {
    const now = Date.now();
    let cacheEntries = [...globalCache.entries()];
    
    // Remover itens expirados
    cacheEntries.forEach(([k, item]) => {
      if (now - item.timestamp > ttl) {
        globalCache.delete(k);
      }
    });
    
    // Limitar tamanho do cache (remover os mais antigos)
    if (globalCache.size > maxSize) {
      cacheEntries = [...globalCache.entries()];
      cacheEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remover os itens mais antigos até atingir o tamanho máximo
      const toRemove = cacheEntries.slice(0, cacheEntries.length - maxSize);
      toRemove.forEach(([k]) => globalCache.delete(k));
    }
  };

  // Carregar dados com suporte a cache
  const loadData = async (forceRefresh = false) => {
    // Skip if already loading
    if (isLoading) return;
    
    // Verificar se há dados em cache válidos
    const cachedItem = globalCache.get(key);
    const now = Date.now();
    
    // Se tiver dados em cache válidos e não for forçar atualização
    if (!forceRefresh && cachedItem && now - cachedItem.timestamp < ttl) {
      setData(cachedItem.data);
      return;
    }
    
    // Carregar do servidor
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      
      // Armazenar em cache
      globalCache.set(key, {
        data: result,
        timestamp: Date.now()
      });
      
      setData(result);
      cleanupCache();
    } catch (err) {
      console.error(`Error fetching data for key ${key}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar um item específico do cache
  const invalidateCache = (specificKey = key) => {
    globalCache.delete(specificKey);
  };

  // Limpar todo o cache
  const clearAllCache = () => {
    globalCache.clear();
  };

  // Carregar dados quando o componente montar ou a key mudar
  useEffect(() => {
    loadData();
  }, [key]);

  return {
    data,
    isLoading,
    error,
    refresh: () => loadData(true),
    invalidateCache,
    clearAllCache
  };
}
