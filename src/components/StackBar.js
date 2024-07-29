import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ dimensions, stackMapping, horizontal = true }) => {
  // Create series based on the stackMapping
  const series = dimensions.slice(1).map((dim) => ({
    name: dim,
    type: 'bar',
    stack: stackMapping[dim] || 'defaultStack', // Use the provided stack or default
    encode: {
      x: horizontal ? dim : 'category',
      y: horizontal ? 'category' : dim
    }
  }));

  return {
    series
  };
};

const StackBar = ({ config, data, stackMapping = {}, horizontal = true }) => {
  const chartRef = useECharts({
    config: { ...config, horizontal },
    data,
    getOptions: ({ dimensions }) =>
      getOptions({ dimensions, stackMapping, horizontal })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default StackBar;
