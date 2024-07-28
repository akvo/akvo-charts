import React, { useMemo } from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const MAX = 70;

const getOptions = ({ data = [], radius }) => ({
  series: [
    {
      radius,
      data: data.map((item) => ({ name: item.label, value: item.value }))
    }
  ]
});

const Doughnut = ({ config, data, size = 40 }) => {
  const torus = useMemo(() => {
    if (size >= 70) {
      return 0;
    }
    return MAX - size;
  }, [size]);

  const chartRef = useECharts({
    config,
    data,
    getOptions: ({ data }) =>
      getOptions({ data, radius: [`${torus}%`, `${MAX}%`] })
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
