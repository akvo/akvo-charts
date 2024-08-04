import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ dimensions = [], overrideItemStyle }) => {
  const itemName = dimensions[0];
  const value = dimensions.slice(1);
  return {
    series: [
      {
        type: 'pie',
        radius: '60%',
        encode: {
          itemName,
          value
        },
        ...overrideItemStyle
      }
    ]
  };
};

const Pie = ({ config, data }) => {
  const chartRef = useECharts({
    config: { ...config, showAxis: false },
    data,
    getOptions: ({ dimensions, overrideItemStyle }) =>
      getOptions({ dimensions, overrideItemStyle })
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
