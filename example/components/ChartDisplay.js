'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Bar,
  Doughnut,
  Line,
  MapView,
  Pie,
  ScatterPlot,
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
  stackChartExampleData,
  scatterPlotExampleData
} from '../static/config';

const ChartDisplay = () => {
  const { isRaw, rawConfig, defaultConfig, mapConfig, isMap } =
    useChartContext();
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

    if (selectedChartType === chartTypes.SCATTER_PLOT) {
      res = {
        ...res,
        data: scatterPlotExampleData
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
  }, [isRaw, defaultConfig, selectedChartType, rawConfig]);

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
      case chartTypes.SCATTER_PLOT:
        return <ScatterPlot {...props} />;
      case chartTypes.STACK_LINE:
        return <StackLine {...props} />;
      case chartTypes.MAP:
        return <MapView {...mapConfig} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${isMap ? '' : 'pt-10'} h-2/3`}>{chartComponent()}</div>
  );
};

export default ChartDisplay;
