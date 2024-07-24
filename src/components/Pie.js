import React from 'react';
import { useECharts } from '../hooks';

const getOptions = ({ data = [] }) => ({
  series: [
    {
      type: 'pie',
      data: data.map((item) => ({ name: item.label, value: item.value }))
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
