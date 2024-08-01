'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Bar,
  Doughnut,
  Line,
  Pie,
  StackBar,
  StackClusterColumn,
  StackLine
} from 'akvo-charts';
import { useChartContext } from '../context/ChartContextProvider';
import { useDisplayContext } from '../context/DisplayContextProvider';
import {
  chartTypes,
  excludeStackMapping,
  excludeHorizontal,
  basicChart,
  stackChartExampleData
} from '../static/config';

const ChartDisplay = () => {
  const { isRaw, rawConfig, defaultConfig } = useChartContext();
  const { selectedChartType, showJson, showCode } = useDisplayContext();

  const [fullscreen, setFullscreen] = useState(false);

  const props = useMemo(() => {
    if (isRaw) {
      return rawConfig;
    }
    let res = { ...defaultConfig };
    if (!basicChart.includes(selectedChartType)) {
      res = {
        ...res,
        data: stackChartExampleData
      };
    }
    if (excludeHorizontal.includes(selectedChartType)) {
      const transform = { ...res };
      delete transform.horizontal;
      res = transform;
    }
    if (excludeStackMapping.includes(selectedChartType)) {
      const transform = { ...res };
      delete transform.stackMapping;
      res = transform;
    }
    return res;
  }, [selectedChartType, defaultConfig, isRaw]);

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
      case chartTypes.STACK_LINE:
        return <StackLine {...props} />;
      default:
        return null;
    }
  };

  return <div className="pt-10">{chartComponent()}</div>;
};

export default ChartDisplay;
