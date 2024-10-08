import React, { forwardRef, useImperativeHandle } from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({ dimensions = [], overrideItemStyle }) => {
  const itemName = dimensions[0];
  const value = dimensions.slice(1);
  return {
    series: [
      {
        type: 'pie',
        radius: '60%',
        encode: {
          itemName,
          value
        },
        ...overrideItemStyle
      }
    ]
  };
};

const Pie = ({ config, data, rawConfig }, ref) => {
  const [chartRef, chartInstance] = useECharts({
    rawOverrides: {
      type: 'pie'
    },
    rawConfig,
    config: { ...config, showAxis: false },
    data,
    getOptions: ({ dimensions, overrideItemStyle }) =>
      getOptions({ dimensions, overrideItemStyle })
  });

  useImperativeHandle(ref, () => chartInstance);

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default forwardRef(Pie);
