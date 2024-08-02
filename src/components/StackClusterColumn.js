import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({
  transformedConfig,
  horizontal = false,
  dimensions = [],
  overrideItemStyle
}) => {
  const series = dimensions.slice(1).map((dim) => ({
    name: dim,
    type: 'bar',
    barGap: 0,
    encode: {
      x: horizontal ? dim : 'category',
      y: horizontal ? 'category' : dim
    },
    ...overrideItemStyle
  }));

  return {
    tooltip: {
      ...transformedConfig.tooltip,
      trigger: 'axis'
    },
    series
  };
};

const StackClusterColumn = ({ config, data, horizontal = false }) => {
  const chartRef = useECharts({
    config: { ...config, horizontal },
    data,
    getOptions: ({ dimensions, transformedConfig, overrideItemStyle }) =>
      getOptions({
        horizontal,
        dimensions,
        transformedConfig,
        overrideItemStyle
      })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default StackClusterColumn;
