import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ horizontal = false }) => {
  const encode = horizontal
    ? { x: 'value', y: 'category' }
    : { x: 'category', y: 'value' };
  return {
    series: [
      {
        type: 'line',
        encode
      }
    ]
  };
};

const Line = ({ config, data, horizontal = false }) => {
  const chartRef = useECharts({
    config: { ...config, horizontal },
    data,
    getOptions: () => getOptions({ horizontal })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default Line;
