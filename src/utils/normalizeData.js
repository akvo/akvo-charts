const sortKeys = (keys = []) => {
  // Identify the key to be placed first based on criteria
  const dynamicKey = keys.find((key) => isNaN(key));
  const otherKeys = keys.filter((key) => key !== dynamicKey);
  // Combine the dynamic key with the other keys
  return [dynamicKey, ...otherKeys];
};

const normalizeData = (data) => {
  if (data?.length === 0) {
    return {
      dimensions: [],
      source: []
    };
  }
  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0])) {
      // Handle tabular format (2d array)
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
      // Handle key-value format (Row based key-value format (object array))
      const keys = Array.from(
        new Set(data.flatMap((d) => (d ? Object.keys(d) : [])))
      );
      const sortedKeys = sortKeys(keys);

      const dimensions = sortedKeys;
      const source = data
        .filter((i) => i)
        .map((item) => {
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
    // Handle object-based format (Column based key-value format)
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
