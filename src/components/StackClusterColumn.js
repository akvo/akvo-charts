import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';
import { Tooltip } from '../utils/basicChartStyle';

const getOptions = ({ horizontal = false, dimensions = [] }) => {
  const series = dimensions.slice(1).map((dim) => ({
    name: dim,
    type: 'bar',
    barGap: 0,
    encode: {
      x: horizontal ? dim : 'category',
      y: horizontal ? 'category' : dim
    }
  }));

  return {
    tooltip: {
      ...Tooltip,
      trigger: 'axis'
    },
    series
  };
};

const StackClusterColumn = ({ config, data, horizontal = false }) => {
  const chartRef = useECharts({
    config: { ...config, horizontal },
    data,
    getOptions: ({ dimensions }) => getOptions({ horizontal, dimensions })
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
