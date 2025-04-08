export const extractDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toDate = (dateString: string): Date => {
  const [year, month, day] = dateString.includes('T')
    ? dateString.split('T')[0].split('-').map(Number)
    : dateString.split('-').map(Number);
  if (!dateString.includes('T')) {
    const [year, month, day] = dateString.substring(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(Date.UTC(year, month - 1, day));
};
