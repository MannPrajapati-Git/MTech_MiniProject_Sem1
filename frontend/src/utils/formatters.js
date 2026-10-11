// Format INR Currency
export const formatINR = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format Weight in KG
export const formatWeight = (kg) => {
  if (kg === null || kg === undefined) return '0 kg';
  return `${Number(kg).toLocaleString('en-IN')} kg`;
};

// Format Date readable (e.g. 15 Oct 2025)
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};