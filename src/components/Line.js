import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ data = [], horizontal = false }) => {
  const axis = horizontal ? 'yAxis' : 'xAxis';
  return {
    [axis]: {
      data: data.map((item) => item.label)
    },
    series: [
      {
        data: data.map((item) => item.value),
        type: 'line'
      }
    ]
  };
};

const Line = ({ config, data, horizontal = false }) => {
  const chartRef = useECharts({
    config: { ...config, horizontal },
    data,
    getOptions: ({ data }) => getOptions({ data, horizontal })
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
