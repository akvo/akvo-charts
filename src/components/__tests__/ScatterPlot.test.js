import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';

import ScatterPlot from '../ScatterPlot';

describe('ScatterPlot', () => {
  it('renders ScatterPlot correctly', () => {
    const data = [
      [10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81]
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    render(
      <ScatterPlot
        config={config}
        data={data}
        symbolSize={25}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  it('matches ScatterPlot snapshot', () => {
    const data = [
      [10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81]
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    const tree = renderer
      .create(
        <ScatterPlot
          config={config}
          data={data}
          symbolSize={25}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
