import normalizeData from '../normalizeData';

describe('normalizeData', () => {
  test('should handle tabular format with consistent data', () => {
    const data = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ];

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', '2015', '2016', '2017'],
      source: [
        { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
        { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
        { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
        { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
      ]
    });
  });

  test('should handle key-value format with consistent data', () => {
    const data = [
      { product: 'Matcha Latte', count: 823, score: 95.8 },
      { product: 'Milk Tea', count: 235, score: 81.4 },
      { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
      { product: 'Walnut Brownie', count: 988, score: 76.9 }
    ];

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', 'count', 'score'],
      source: [
        { product: 'Matcha Latte', count: 823, score: 95.8 },
        { product: 'Milk Tea', count: 235, score: 81.4 },
        { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
        { product: 'Walnut Brownie', count: 988, score: 76.9 }
      ]
    });
  });

  test('should handle object-based format with consistent data', () => {
    const data = {
      product: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
      count: [823, 235, 1042, 988],
      score: [95.8, 81.4, 91.2, 76.9]
    };

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', 'count', 'score'],
      source: [
        { product: 'Matcha Latte', count: 823, score: 95.8 },
        { product: 'Milk Tea', count: 235, score: 81.4 },
        { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
        { product: 'Walnut Brownie', count: 988, score: 76.9 }
      ]
    });
  });

  test('should handle inconsistent data in tabular format', () => {
    const data = [
      ['product', '2015', '2016', '2017', '2018'],
      ['Matcha Latte', 43.3, 85.8, 93.7, 50],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ];

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', '2015', '2016', '2017', '2018'],
      source: [
        {
          product: 'Matcha Latte',
          2015: 43.3,
          2016: 85.8,
          2017: 93.7,
          2018: 50
        },
        { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1, 2018: 0 },
        {
          product: 'Cheese Cocoa',
          2015: 86.4,
          2016: 65.2,
          2017: 82.5,
          2018: 0
        },
        {
          product: 'Walnut Brownie',
          2015: 72.4,
          2016: 53.9,
          2017: 39.1,
          2018: 0
        }
      ]
    });
  });

  test('should handle inconsistent data in object-based format', () => {
    const data = {
      product: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
      count: [823, 235, 1042, 988],
      score: [95.8, 81.4, 91.2]
    };

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', 'count', 'score'],
      source: [
        { product: 'Matcha Latte', count: 823, score: 95.8 },
        { product: 'Milk Tea', count: 235, score: 81.4 },
        { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
        { product: 'Walnut Brownie', count: 988, score: 0 }
      ]
    });
  });

  test('should handle inconsistent data in object-based format with year based key', () => {
    const data = {
      product: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
      2017: [823, 235, 1042, 988],
      2018: [95.8, 81.4, 91.2],
      2019: [10, 20]
    };

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', '2017', '2018', '2019'],
      source: [
        { product: 'Matcha Latte', 2017: 823, 2018: 95.8, 2019: 10 },
        { product: 'Milk Tea', 2017: 235, 2018: 81.4, 2019: 20 },
        { product: 'Cheese Cocoa', 2017: 1042, 2018: 91.2, 2019: 0 },
        { product: 'Walnut Brownie', 2017: 988, 2018: 0, 2019: 0 }
      ]
    });
  });

  test('should handle inconsistent data in object-based format with varying keys', () => {
    const data = [
      { product: 'Matcha Latte', count: 823, score: 95.8 },
      { product: 'Milk Tea', count: 235, score: 81.4, avg: 44 },
      { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
      { product: 'Walnut Brownie', count: 988, score: 76.9 }
    ];

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', 'count', 'score', 'avg'],
      source: [
        { product: 'Matcha Latte', count: 823, score: 95.8, avg: 0 },
        { product: 'Milk Tea', count: 235, score: 81.4, avg: 44 },
        { product: 'Cheese Cocoa', count: 1042, score: 91.2, avg: 0 },
        { product: 'Walnut Brownie', count: 988, score: 76.9, avg: 0 }
      ]
    });
  });

  test('should handle inconsistent data in object-based format with varying keys and year based key', () => {
    const data = [
      { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
      { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
      { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5, 2018: 91 },
      { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
    ];

    const result = normalizeData(data);

    expect(result).toEqual({
      dimensions: ['product', '2015', '2016', '2017', '2018'],
      source: [
        {
          product: 'Matcha Latte',
          2015: 43.3,
          2016: 85.8,
          2017: 93.7,
          2018: 0
        },
        { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1, 2018: 0 },
        {
          product: 'Cheese Cocoa',
          2015: 86.4,
          2016: 65.2,
          2017: 82.5,
          2018: 91
        },
        {
          product: 'Walnut Brownie',
          2015: 72.4,
          2016: 53.9,
          2017: 39.1,
          2018: 0
        }
      ]
    });
  });

  test('should handle unsupported data format', () => {
    expect(() => {
      normalizeData('invalid format');
    }).toThrow('Unsupported data format');
  });
});
