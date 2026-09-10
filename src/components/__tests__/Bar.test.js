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
  test('renders a toolbox and keeps interaction state across a re-render', async () => {
    const data = [
      { product: 'Product 1', sales: 30 },
      { product: 'Product 2', sales: 20 }
    ];
    const config = {
      title: 'Toolbox Bar',
      renderer: 'svg',
      width: 400,
      height: 400,
      toolbox: true
    };

    const ref = React.createRef();
    const { rerender } = render(
      <Bar
        config={config}
        data={data}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    const { toolbox } = ref.current.getOption();
    expect(toolbox[0].feature.saveAsImage).toBeDefined();
    expect(toolbox[0].feature.myCsv).toBeDefined();
    expect(toolbox[0].feature.magicType).toBeDefined();
    expect(toolbox[0].feature.dataZoom).toBeDefined();

    // Stand in for the user clicking the type switch, then force a re-render
    // with fresh object identities the way a parent setState would.
    ref.current.setOption({ series: [{ type: 'line' }] });
    rerender(
      <Bar
        config={{ ...config }}
        data={[...data]}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current.getOption().series[0].type).toEqual('line');
    });
  });

  test('drops series that no longer exist when the data shrinks', async () => {
    // This is why the hook replaces the whole option instead of merging: without
    // that, ECharts keeps the third series after the data loses two columns.
    const wide = [
      { product: 'P1', a: 1, b: 2, c: 3 },
      { product: 'P2', a: 4, b: 5, c: 6 }
    ];
    const narrow = [
      { product: 'P1', a: 1 },
      { product: 'P2', a: 4 }
    ];
    const config = {
      title: 'Shrink',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    const ref = React.createRef();
    const { rerender } = render(
      <Bar
        config={config}
        data={wide}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });
    expect(ref.current.getOption().series).toHaveLength(3);

    rerender(
      <Bar
        config={{ ...config }}
        data={narrow}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current.getOption().series).toHaveLength(1);
    });
  });

  test('restores to the configured chart, not to an empty one', async () => {
    const data = [
      { product: 'Product 1', sales: 30 },
      { product: 'Product 2', sales: 20 }
    ];
    const ref = React.createRef();
    render(
      <Bar
        config={{
          title: 'Restorable',
          renderer: 'svg',
          width: 400,
          height: 400,
          toolbox: true
        }}
        data={data}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    // ECharts' restore recreates from the option recorded on the FIRST setOption
    // of the instance. chartInstance.clear() is setOption({series: []}, true), so
    // clearing before the real setOption made that baseline an empty chart.
    ref.current.dispatchAction({ type: 'restore' });

    await waitFor(() => {
      expect(ref.current.getOption().series).toHaveLength(1);
    });
    expect(ref.current.getOption().dataset[0].source).toHaveLength(2);
  });

  test('emits no toolbox key when config.toolbox is absent', async () => {
    const ref = React.createRef();
    render(
      <Bar
        config={{
          title: 'No Toolbox',
          renderer: 'svg',
          width: 400,
          height: 400
        }}
        data={[{ product: 'Product 1', sales: 30 }]}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    // ECharts reports an unregistered component as an empty array, not a
    // missing key; either way no toolbox exists.
    expect(ref.current.getOption().toolbox || []).toHaveLength(0);
  });

  test('ignores config.toolbox entirely when rawConfig is provided', async () => {
    const ref = React.createRef();
    render(
      <Bar
        config={{
          title: 'Ignored',
          renderer: 'svg',
          width: 400,
          height: 400,
          toolbox: true
        }}
        rawConfig={{
          xAxis: { type: 'category', data: ['a', 'b'] },
          yAxis: { type: 'value' },
          series: [{ data: [1, 2] }]
        }}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    // rawConfig is a branch, not a merge: the whole config path is skipped.
    // This locks the contract against a future "helpful" fill-in.
    // ECharts reports an unregistered component as an empty array, not a
    // missing key; either way no toolbox exists.
    expect(ref.current.getOption().toolbox || []).toHaveLength(0);
  });
});
