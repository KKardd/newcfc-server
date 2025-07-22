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

export const convertKstToUtc = (kstDateTime: string | Date): Date => {
  let date: Date;
  
  if (typeof kstDateTime === 'string') {
    if (kstDateTime.includes('T')) {
      date = new Date(kstDateTime + (kstDateTime.endsWith('Z') ? '' : '+09:00'));
    } else {
      date = new Date(kstDateTime + 'T00:00:00+09:00');
    }
  } else {
    const kstOffset = 9 * 60 * 60 * 1000;
    date = new Date(kstDateTime.getTime() - kstOffset);
  }
  
  return date;
};

export const convertUtcToKst = (utcDateTime: Date): Date => {
  const kstOffset = 9 * 60 * 60 * 1000;
  return new Date(utcDateTime.getTime() + kstOffset);
};

export const parseKstDateTime = (kstDateTime: string | Date): Date => {
  if (typeof kstDateTime === 'string') {
    if (kstDateTime.includes('T')) {
      return new Date(kstDateTime.endsWith('Z') || kstDateTime.includes('+') || kstDateTime.includes('-') ? kstDateTime : kstDateTime + '+09:00');
    } else {
      return new Date(kstDateTime + 'T00:00:00+09:00');
    }
  }
  return kstDateTime;
};

export const createKstDateRange = (kstDate: Date, isStartOfDay = true): Date => {
  const year = kstDate.getFullYear();
  const month = kstDate.getMonth();
  const day = kstDate.getDate();
  
  const kstDateTime = isStartOfDay 
    ? new Date(year, month, day, 0, 0, 0, 0)
    : new Date(year, month, day, 23, 59, 59, 999);
  
  return convertKstToUtc(kstDateTime);
};
