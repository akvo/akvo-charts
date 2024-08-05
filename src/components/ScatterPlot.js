import React from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const scatterTransform = (input) => {
  if (Array.isArray(input)) {
    // Check if it's a 2D array
    if (Array.isArray(input[0])) {
      return input.map(([label, x, y]) => [x, y, label]);
    }

    // Check if it's an array of key-value objects
    if (typeof input[0] === 'object' && !Array.isArray(input[0])) {
      return input.map(({ label, x, y }) => [x, y, label]);
    }
  }

  // Check if it's an array containing an object
  if (typeof input === 'object') {
    return Object.keys(input).map((key) => [...input[key], key]);
  }

  throw new Error('Invalid input format');
};

const getOptions = ({
  data,
  symbolSize,
  showLabel,
  transformedConfig,
  overrideItemStyle
}) => {
  return {
    series: [
      {
        type: 'scatter',
        symbolSize,
        emphasis: {
          focus: 'self'
        },
        label: {
          show: showLabel,
          formatter: (p) => p.data[2],
          minMargin: 10,
          position: 'top'
        },
        ...overrideItemStyle
      }
    ],
    xAxis: {
      ...transformedConfig.xAxis,
      splitLine: {
        show: true
      }
    },
    dataset: {
      source: scatterTransform(data)
    }
  };
};

const ScatterPlot = ({ config, data, symbolSize = 10, showLabel = true }) => {
  const chartRef = useECharts({
    config,
    getOptions: ({ transformedConfig, overrideItemStyle }) =>
      getOptions({
        data,
        symbolSize,
        showLabel,
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

export default ScatterPlot;
