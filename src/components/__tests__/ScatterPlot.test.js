import React from 'react';
import { render, screen } from '@testing-library/react';
import ScatterPlot from '../ScatterPlot';
import renderer from 'react-test-renderer';

describe('ScatterPlot chart', () => {
  test('renders ScatterPlot component with 2d array data format', () => {
    const data = [
      ['x', 'cluster3'],
      ['85.8', 43.3],
      ['73.4', 83.1],
      ['65.2', 86.4],
      ['53.9', 72.4]
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    render(
      <ScatterPlot
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders ScatterPlot component with row based key-value format (object array)', () => {
    const data = [
      { x: 2, cluster2: 11 },
      { x: 7, cluster2: 5 },
      { x: 11, cluster2: 20 },
      { x: 21, cluster2: 3 }
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    render(
      <ScatterPlot
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders ScatterPlot component with column based key-value format', () => {
    const data = {
      x: [2, 6, 8, 9],
      cluster1: [8, 13, 15, 17]
    };

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    render(
      <ScatterPlot
        config={config}
        data={data}
        symbolSize={50}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('matches ScatterPlot snapshot', () => {
    const data = [
      ['x', 'cluster3'],
      ['85.8', 43.3],
      ['73.4', 83.1],
      ['65.2', 86.4],
      ['53.9', 72.4]
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    const tree = renderer
      .create(
        <ScatterPlot
          config={config}
          data={data}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
