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
import { chartTypes } from '../static/config';

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

  const chartComponent = () => {
    switch (selectedChartType) {
      case chartTypes.BAR:
        return <Bar {...props} />;
      case chartTypes.LINE:
        return <Line {...props} />;
      case chartTypes.PIE:
        return <Pie {...props} />;
      case chartTypes.DOUGHNUT:
        return <Doughnut {...props} />;
      case chartTypes.STACK_BAR:
        return <StackBar {...props} />;
      case chartTypes.STACK_CLUSTER:
        return <StackClusterColumn {...props} />;
      default:
        return null;
    }
  };

  return <div className="pt-10">{chartComponent()}</div>;
};

export default ChartDisplay;
