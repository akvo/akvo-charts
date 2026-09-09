import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Pie from '../Pie';

describe('Pie chart', () => {
  test('renders Pie component with 2d array data format', () => {
    const data = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ];

    const config = {
      title: 'Pie Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <Pie
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders Pie component with row based key-value format (object array)', () => {
    const data = [
      { product: 'Matcha Latte', count: 823, score: 95.8 },
      { product: 'Milk Tea', count: 235, score: 81.4 },
      { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
      { product: 'Walnut Brownie', count: 988, score: 76.9 }
    ];

    const config = {
      title: 'Pie Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <Pie
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders Pie component with column based key-value format', () => {
    const data = {
      product: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
      count: [823, 235, 1042, 988],
      score: [95.8, 81.4, 91.2, 76.9]
    };

    const config = {
      title: 'Pie Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <Pie
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('matches Pie snapshot', async () => {
    const data = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ];

    const config = {
      title: 'Pie Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    const ref = React.createRef();
    render(
      <Pie
        config={config}
        data={data}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current.renderToSVGString()).toMatchSnapshot();
    });
  });
  test('renders a toolbox without the axis-only tools', async () => {
    const ref = React.createRef();
    render(
      <Pie
        config={{
          title: 'Toolbox Pie',
          renderer: 'svg',
          width: 400,
          height: 400,
          toolbox: true
        }}
        data={[{ product: 'Product 1', sales: 30 }]}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    const { feature } = ref.current.getOption().toolbox[0];
    expect(feature.saveAsImage).toBeDefined();
    expect(feature.myCsv).toBeDefined();
    expect(feature.dataZoom).toBeUndefined();
    expect(feature.magicType).toBeUndefined();
    expect(feature.restore).toBeUndefined();
  });
});
