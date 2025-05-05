
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Calculate minutes elapsed since a given timestamp
export const getMinutesElapsed = (timestamp: string): number => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  return Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
};

// Format elapsed time for display
export const formatElapsedTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  } else {
    const days = Math.floor(minutes / (24 * 60));
    return `${days}d`;
  }
};
