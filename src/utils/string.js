export const string2WindowObj = (path = '') => {
  const obj = path.split('.').reduce((obj, key) => obj && obj[key], window);
  if (typeof obj === 'undefined' || typeof obj === 'string') {
    return null;
  }
  return obj;
};
