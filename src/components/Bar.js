import React from 'react';
import { useECharts } from '../hooks';

const getOptions = ({ data = [], horizontal = false }) => {
  const axis = horizontal ? 'yAxis' : 'xAxis';
  return {
    [axis]: {
      data: data.map((item) => item.label)
    },
    series: [
      {
        data: data.map((item) => item.value),
        type: 'bar'
      }
    ]
  };
};

const Bar = ({ config, data, horizontal = false }) => {
  const chartRef = useECharts({
    config: { ...config, horizontal },
    data,
    getOptions: ({ data }) => getOptions({ data, horizontal })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default Bar;
