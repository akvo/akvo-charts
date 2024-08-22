import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import * as echarts from 'echarts';
import useECharts from '../useECharts';
import transformConfig, {
  filterObjNullValue
} from '../../utils/transformConfig';
import normalizeData from '../../utils/normalizeData';

// Mock the echarts library
jest.mock('echarts');
jest.mock('../../utils/transformConfig');
jest.mock('../../utils/normalizeData');

describe('useECharts', () => {
  let chartInstanceMock;

  beforeEach(() => {
    chartInstanceMock = {
      setOption: jest.fn(),
      dispose: jest.fn(),
      clear: jest.fn()
    };
    echarts.init = jest.fn(() => chartInstanceMock);
    transformConfig.mockImplementation((config) => config);
    filterObjNullValue.mockImplementation((obj) => obj);
    normalizeData.mockImplementation((data) => ({
      dimensions: ['dimension1', 'dimension2'],
      source: data
    }));
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const TestComponent = ({ config, data, getOptions, rawConfig }) => {
    const [chartRef] = useECharts({ config, data, getOptions, rawConfig });
    return <div ref={chartRef} />;
  };

  it('should initialize the chart and set options based on config and data', async () => {
    const config = { horizontal: true, itemStyle: { color: 'red' } };
    const data = [{ dimension1: 'A', dimension2: 10 }];
    const getOptions = jest.fn(() => ({}));

    const { container } = render(
      <TestComponent
        config={config}
        data={data}
        getOptions={getOptions}
      />
    );

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    await waitFor(() => {
      expect(echarts.init).toHaveBeenCalledWith(container.firstChild, null, {
        renderer: 'canvas'
      });

      expect(transformConfig).toHaveBeenCalledWith({
        ...config,
        dimensions: ['dimension1', 'dimension2']
      });
      expect(filterObjNullValue).toHaveBeenCalledWith(config.itemStyle);
      expect(normalizeData).toHaveBeenCalledWith(data);

      expect(getOptions).toHaveBeenCalledWith({
        dimensions: ['dimension1', 'dimension2'],
        transformedConfig: {
          ...config,
          dimensions: ['dimension1', 'dimension2']
        },
        overrideItemStyle: { itemStyle: { color: 'red' } },
        horizontal: true
      });

      expect(chartInstanceMock.setOption).toHaveBeenCalledWith(
        expect.objectContaining({
          dataset: {
            dimensions: ['dimension1', 'dimension2'],
            source: data
          }
        })
      );
    });
  });

  it('should handle rawConfig and set options accordingly', async () => {
    const rawConfig = { title: { text: 'Raw Config Chart' } };

    render(<TestComponent rawConfig={rawConfig} />);

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    await waitFor(() => {
      expect(chartInstanceMock.setOption).toHaveBeenCalledWith(rawConfig);
    });
  });

  it('should clean up the chart on unmount', async () => {
    const { unmount } = render(<TestComponent />);

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    unmount();

    await waitFor(() => {
      expect(chartInstanceMock.clear).toHaveBeenCalled();
      expect(chartInstanceMock.clear).toHaveBeenCalledTimes(1);
    });
  });
});
