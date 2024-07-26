import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ data = [] }) => ({
  series: [
    {
      type: 'pie',
      data: data.map((item) => ({ name: item.label, value: item.value }))
    }
  ]
});

const Pie = ({ config, data }) => {
  const chartRef = useECharts({
    config,
    data,
    getOptions: ({ data }) => getOptions({ data })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default Pie;
