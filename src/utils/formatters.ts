
/**
 * Formats a number as currency (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date to a human readable string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

/**
 * Calculate time elapsed in minutes
 */
export const getMinutesElapsed = (dateString: string): number => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  } catch (error) {
    return 0;
  }
};

/**
 * Format elapsed time with appropriate units
 */
export const formatElapsedTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  } else {
    return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
  }
};
