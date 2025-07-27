import { useMemo } from 'react';

export const useSimpleDate = (dateString: string) => {
  return useMemo(() => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [dateString]);
};