// Date utility functions for consistent formatting across the application
// Using dd/mm/yyyy format (UK/European format)

export const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric'
  });
  const end = new Date(endDate).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return `${start} - ${end}`;
};

export const formatDateNumeric = (dateString) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateLong = (dateString) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};