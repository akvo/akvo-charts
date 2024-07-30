import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';

import ScatterPlot from '../ScatterPlot';

jest.useFakeTimers();

describe('ScatterPlot', () => {
  it('renders ScatterPlot correctly', async () => {
    const data = [
      [10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81]
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    let instance = null;
    render(
      <ScatterPlot
        config={config}
        data={data}
        symbolSize={25}
        ref={(el) => {
          instance = el;
        }}
        isTest
      />
    );

    await waitFor(() => {
      const chartContainer = screen.getByRole('figure');
      expect(chartContainer).toBeInTheDocument();
      expect(instance).toBeDefined();
      expect(instance.getChartInstance().renderToSVGString()).toContain('9.05');
    });
  });

  it('renders ScatterPlot incorrectly', async () => {
    const data = [{ label: 'x', value: 9.05 }];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

    let instance = null;
    render(
      <ScatterPlot
        config={config}
        data={data}
        symbolSize={25}
        ref={(el) => {
          instance = el;
        }}
        isTest
      />
    );

    await waitFor(() => {
      expect(instance).toBeDefined();
      expect(instance.getChartInstance().renderToSVGString()).not.toContain(
        '9.05'
      );
    });
  });

  it('matches ScatterPlot snapshot', async () => {
    const data = [
      [10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81]
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };
    const { container } = render(
      <ScatterPlot
        config={config}
        data={data}
        symbolSize={25}
        isTest
      />
    );
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
