import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ dimensions = [] }) => {
  const itemName = dimensions[0];
  const value = dimensions.slice(1);
  return {
    series: [
      {
        type: 'pie',
        encode: {
          itemName,
          value
        }
      }
    ]
  };
};

const Pie = ({ config, data }) => {
  const chartRef = useECharts({
    config,
    data,
    getOptions: ({ dimensions }) => getOptions({ dimensions })
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
