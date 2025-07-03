export const jsonParseSafe = (str?: string) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
};

export const formatNumber = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
