'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  Doughnut,
  Line,
  Pie,
  StackBar,
  StackClusterColumn
} from 'akvo-charts';
import { useChartContext } from '../context/ChartContextProvider';
import { useDisplayContext } from '../context/DisplayContextProvider';

const ChartDisplay = () => {
  const { isRaw, rawConfig, defaultConfig } = useChartContext();
  const { ...props } = isRaw ? rawConfig : defaultConfig;
  const { selectedChartType, showJson, showCode } = useDisplayContext();

  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!showJson && !showCode && !fullscreen) {
      setFullscreen(true);
    }
    if ((showJson || showCode) && fullscreen) {
      setFullscreen(false);
    }
  }, [showJson, showCode, fullscreen]);

  switch (selectedChartType) {
    case 'bar':
      return <Bar {...props} />;
    case 'line':
      return <Line {...props} />;
    case 'pie':
      return <Pie {...props} />;
    case 'doughnut':
      return <Doughnut {...props} />;
    case 'stack-bar':
      return <StackBar {...props} />;
    case 'stack-cluster-column':
      return <StackClusterColumn {...props} />;
    default:
      return null;
  }
};

export default ChartDisplay;
