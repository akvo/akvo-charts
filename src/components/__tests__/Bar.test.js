import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Bar from '../Bar';

describe('Bar chart', () => {
  test('renders Bar component with 2d array data format', async () => {
    const data = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ];

    const config = {
      title: 'Bar Chart Example',
      xAxisLabel: 'Categories',
      yAxisLabel: 'Values',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    const ref = React.createRef();
    render(
      <Bar
        config={config}
        data={data}
        ref={ref}
      />
    );

    await waitFor(() => {
      const chartContainer = screen.getByRole('figure');
      expect(chartContainer).toBeInTheDocument();
    });
  });

  test('renders Bar component with row based key-value format (object array)', () => {
    const data = [
      { product: 'Matcha Latte', count: 823, score: 95.8 },
      { product: 'Milk Tea', count: 235, score: 81.4 },
      { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
      { product: 'Walnut Brownie', count: 988, score: 76.9 }
    ];

    const config = {
      title: 'Bar Chart Example',
      xAxisLabel: 'Categories',
      yAxisLabel: 'Values',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <Bar
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders Bar component with column based key-value format', () => {
    const data = {
      product: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
      count: [823, 235, 1042, 988],
      score: [95.8, 81.4, 91.2, 76.9]
    };

    const config = {
      title: 'Bar Chart Example',
      xAxisLabel: 'Categories',
      yAxisLabel: 'Values',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <Bar
        config={config}
        data={data}
        horizontal={true}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('matches Bar snapshot', async () => {
    const data = [
      {
        product: 'Product 1',
        sales: 30
      },
      {
        product: 'Product 2',
        sales: 20
      },
      {
        product: 'Product 3',
        sales: 50
      },
      {
        product: 'Product 4',
        sales: 45
      },
      {
        product: 'Product 5',
        sales: 40
      }
    ];

    const config = {
      title: 'Bar Chart Example',
      xAxisLabel: 'Product',
      yAxisLabel: 'Sales',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    const ref = React.createRef();
    render(
      <Bar
        config={config}
        data={data}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current.renderToSVGString()).toMatchSnapshot();
    });
  });
});
