import React, { useMemo } from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const MAX = 60;

const getOptions = ({ dimensions = [], radius }) => {
  const itemName = dimensions[0];
  const value = dimensions.slice(1);
  return {
    series: [
      {
        type: 'pie',
        radius,
        encode: {
          itemName,
          value
        }
      }
    ]
  };
};

const Doughnut = ({ config, data, size = 40 }) => {
  const torus = useMemo(() => {
    if (size >= MAX) {
      return 0;
    }
    return MAX - size;
  }, [size]);

  const chartRef = useECharts({
    config: { ...config, showAxis: false },
    data,
    getOptions: ({ dimensions }) =>
      getOptions({ dimensions, radius: [`${torus}%`, `${MAX}%`] })
  });

  return (
    <div
      ref={chartRef}
      role="figure"
      className={styles.container}
    />
  );
};

export default Doughnut;
