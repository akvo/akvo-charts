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
    type: 'line',
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

const Line = ({ config, data }) => {
  const chartRef = useECharts({
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

export default Line;
