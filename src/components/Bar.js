import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({
  horizontal = false,
  dimensions = [],
  overrideItemStyle
}) => {
  const series = dimensions.slice(1).map((dim) => ({
    name: dim,
    type: 'bar',
    encode: {
      x: horizontal ? dim : 'category',
      y: horizontal ? 'category' : dim
    },
    ...overrideItemStyle
  }));

  return {
    series
  };
};

const Bar = ({ config, data, rawConfig }) => {
  const chartRef = useECharts({
    rawOverrides: {
      type: 'bar'
    },
    rawConfig,
    config,
    data,
    getOptions: ({ dimensions, overrideItemStyle, horizontal }) =>
      getOptions({ horizontal, dimensions, overrideItemStyle })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default Bar;
