import React from 'react';
import { useECharts } from '../hooks';

const getOptions = ({ config = {}, data = [] }) => ({
  ...config,
  xAxis: {
    type: 'category',
    data: data.map((item) => item.label)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: data.map((item) => item.value),
      type: 'line'
    }
  ]
});

const Line = ({ config, data }) => {
  const chartRef = useECharts({ config, data, getOptions });

  return (
    <div
      ref={chartRef}
      role="figure"
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default Line;
