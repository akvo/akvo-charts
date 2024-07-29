const sortKeys = (keys = []) => {
  // Identify the key to be placed first based on criteria
  const dynamicKey = keys.find((key) => isNaN(key));
  const otherKeys = keys.filter((key) => key !== dynamicKey);
  // Combine the dynamic key with the other keys
  return [dynamicKey, ...otherKeys];
};

const normalizeData = (data) => {
  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0])) {
      // Handle tabular format
      const [categories, ...rows] = data;

      const dimensions = categories.map((item) => item.toLowerCase());
      const source = rows.map((row) => {
        const obj = {};
        categories.forEach((cat, index) => {
          obj[cat.toLowerCase()] = row[index] !== undefined ? row[index] : 0;
        });
        return obj;
      });

      return {
        dimensions,
        source
      };
    } else if (data.length > 0 && typeof data[0] === 'object') {
      // Handle key-value format
      const keys = Array.from(new Set(data.flatMap(Object.keys)));
      const sortedKeys = sortKeys(keys);

      const dimensions = sortedKeys;
      const source = data.map((item) => {
        const obj = {};
        sortedKeys.forEach((key) => {
          obj[key] = item[key] !== undefined ? item[key] : 0;
        });
        return obj;
      });

      return {
        dimensions,
        source
      };
    }
  } else if (typeof data === 'object') {
    // Handle object-based format
    const keys = Object.keys(data);
    const maxLength = Math.max(...keys.map((key) => data[key].length));
    const sortedKeys = sortKeys(keys);

    const source = Array.from({ length: maxLength }, (_, i) => {
      return sortedKeys.reduce((acc, key) => {
        acc[key] = data[key][i] !== undefined ? data[key][i] : 0;
        return acc;
      }, {});
    });

    return {
      dimensions: sortedKeys,
      source
    };
  }

  throw new Error('Unsupported data format');
};

export default normalizeData;
