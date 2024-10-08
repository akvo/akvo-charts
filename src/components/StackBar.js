import React, { forwardRef, useImperativeHandle } from 'react';
import { useECharts } from '../hooks';
import styles from '../styles.module.css';

const getOptions = ({
  dimensions,
  stackMapping,
  transformedConfig,
  horizontal,
  overrideItemStyle
}) => {
  // Reverse the stackMapping to get a dimension to stack group map
  const dimensionToStackMap = {};
  Object.keys(stackMapping).forEach((stackGroup) => {
    stackMapping[stackGroup].forEach((dim) => {
      dimensionToStackMap[dim] = stackGroup;
    });
  });

  // Create series based on the reversed stack mapping
  const series = dimensions.slice(1).map((dim) => ({
    name: dim,
    type: 'bar',
    stack: dimensionToStackMap[dim] || 'defaultStack',
    encode: {
      x: horizontal ? dim : 'category',
      y: horizontal ? 'category' : dim
    },
    ...overrideItemStyle
  }));

  return {
    tooltip: {
      ...transformedConfig.tooltip,
      trigger: 'axis'
    },
    series
  };
};

const StackBar = ({ config, data, stackMapping = {}, rawConfig }, ref) => {
  const [chartRef, chartInstance] = useECharts({
    rawOverrides: {
      type: 'bar',
      stack: 'defaultStack'
    },
    rawConfig,
    config,
    data,
    getOptions: ({
      dimensions,
      transformedConfig,
      overrideItemStyle,
      horizontal
    }) =>
      getOptions({
        dimensions,
        stackMapping,
        horizontal,
        transformedConfig,
        overrideItemStyle
      })
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

export default forwardRef(StackBar);
