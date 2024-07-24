import React from 'react';
import { useECharts } from '../hooks';

const getOptions = ({ data = [] }) => ({
  xAxis: {
    data: data.map((item) => item.label)
  },
  series: [
    {
      data: data.map((item) => item.value),
      type: 'bar'
    }
  ]
});

const Bar = ({ config, data }) => {
  const chartRef = useECharts({ config, data, getOptions });

  return (
    <div
      ref={chartRef}
      role="figure"
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default Bar;
