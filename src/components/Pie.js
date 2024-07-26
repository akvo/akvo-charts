import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ data = [], type = 'pie' }) => ({
  series: [
    {
      type: 'pie',
      radius: type === 'donut' ? ['40%', '70%'] : '70%',
      data: data.map((item) => ({ name: item.label, value: item.value }))
    }
  ]
});

const Pie = ({ config, data, type = 'pie' }) => {
  const chartRef = useECharts({
    config,
    data,
    getOptions: ({ data }) => getOptions({ data, type })
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
