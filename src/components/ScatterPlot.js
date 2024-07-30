import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ data = [], symbolSize = 20 }) => {
  return {
    series: [
      {
        symbolSize,
        data: data.filter((d) => Array.isArray(d)),
        type: 'scatter'
      }
    ]
  };
};

const ScatterPlot = ({ config, data, symbolSize = 20 }) => {
  const chartRef = useECharts({
    config,
    data,
    getOptions: ({ data }) => getOptions({ data, symbolSize })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
      data-testid="scatter-plot"
    />
  );
};

export default ScatterPlot;
