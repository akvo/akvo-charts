'use client';
import {
  Bar,
  Doughnut,
  Line,
  Pie,
  StackBar,
  StackClusterColumn
} from 'akvo-charts';
import { useChartContext } from '../context/ChartContextProvider';

const ChartDisplay = () => {
  const { isRaw, rawConfig, defaultConfig } = useChartContext();
  const { type, ...props } = isRaw ? rawConfig : defaultConfig;

  switch (type) {
    case 'bar':
      return <Bar {...props} />;
    case 'line':
      return <Line {...props} />;
    case 'pie':
      return <Pie {...props} />;
    case 'doughnut':
      return <Doughnut {...props} />;
    case 'stack':
      return <StackBar {...props} />;
    case 'stackCluster':
      return <StackClusterColumn {...props} />;
    default:
      return null;
  }
};

export default ChartDisplay;
