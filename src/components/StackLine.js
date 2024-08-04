import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({
  dimensions,
  transformedConfig,
  horizontal = true,
  overrideItemStyle
}) => {
  const axis = horizontal ? 'yAxis' : 'xAxis';

  const series = dimensions.slice(1).map((dim) => ({
    name: dim,
    type: 'line',
    stack: 'defaultStack',
    areaStyle: {},
    encode: {
      x: horizontal ? dim : 'category',
      y: horizontal ? 'category' : dim
    },
    ...overrideItemStyle
  }));

  return {
    ...transformedConfig,
    tooltip: {
      ...transformedConfig.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    [axis]: {
      ...transformedConfig[axis],
      boundaryGap: false
    },
    series
  };
};

const StacLine = ({ config, data, horizontal = true }) => {
  const chartRef = useECharts({
    config: { ...config, horizontal },
    data,
    getOptions: ({ dimensions, transformedConfig, overrideItemStyle }) =>
      getOptions({
        dimensions,
        horizontal,
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

export default StacLine;
