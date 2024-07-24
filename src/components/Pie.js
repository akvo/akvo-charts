import React from 'react';
import { useECharts } from '../hooks';

const getOptions = ({ config = {}, data = [] }) => ({
  ...config,
  series: [
    {
      type: 'pie',
      data: data.map((item) => ({ value: item.value, name: item.label }))
    }
  ]
});

const Pie = ({ config, data }) => {
  const chartRef = useECharts({ config, data, getOptions });

  return (
    <div
      ref={chartRef}
      role="figure"
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default Pie;
