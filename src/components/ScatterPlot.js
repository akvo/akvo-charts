import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = (symbolSize) => {
  return {
    series: [
      {
        type: 'scatter',
        symbolSize
      }
    ]
  };
};

const ScatterPlot = ({ config, data, symbolSize = 10 }) => {
  const chartRef = useECharts({
    config,
    data,
    getOptions: () => getOptions(symbolSize)
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default ScatterPlot;
