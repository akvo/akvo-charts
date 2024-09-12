import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ScatterPlot from '../ScatterPlot';

describe('ScatterPlot chart', () => {
  test('renders ScatterPlot component with 2d array data format', () => {
    const input2D = [
      ['A', 1, 2],
      ['B', 1, 3],
      ['C', 5, 7]
    ];

    const config = {
      title: 'ScatterPlot Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <ScatterPlot
        config={config}
        data={input2D}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders ScatterPlot component with row based key-value format (object array)', () => {
    const inputKeyValue = [
      { label: 'A', x: 1, y: 2 },
      { label: 'B', x: 1, y: 3 },
      { label: 'C', x: 5, y: 7 }
    ];
    const config = {
      title: 'ScatterPlot Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <ScatterPlot
        config={config}
        data={inputKeyValue}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders ScatterPlot component with column based key-value format', () => {
    const inputObj = {
      A: [1, 2],
      B: [1, 3],
      C: [5, 7]
    };

    const config = {
      title: 'ScatterPlot Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    render(
      <ScatterPlot
        config={config}
        data={inputObj}
        symbolSize={50}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('matches ScatterPlot snapshot', async () => {
    const data = [
      ['A', 1, 2],
      ['B', 1, 3],
      ['C', 5, 7]
    ];

    const config = {
      title: 'ScatterPlot Chart Example',
      renderer: 'svg',
      width: 400,
      height: 400
    };

    const ref = React.createRef();
    render(
      <ScatterPlot
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
