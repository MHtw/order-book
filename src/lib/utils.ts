export const jsonParseSafe = (str?: string) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
};
