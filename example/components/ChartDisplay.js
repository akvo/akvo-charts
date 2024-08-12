'use client';

import { useMemo } from 'react';
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
  scatterPlotExampleData,
  basePath
} from '../static/config';

const MapDisplay = ({ layer, ...mapProps }) => {
  const getOnClickFn = (onClickString) => {
    try {
      return onClickString
        ? // eslint-disable-next-line no-new-func
          new Function(`return ${onClickString}`)()
        : null;
    } catch {
      return null;
    }
  };

  const getLayerURL = (layerURL) => {
    /**
     * Add a basePath prefix for the production environment
     * since it cannot automatically point to the GitHub Pages
     * when requesting a /static asset URL.
     */
    return layerURL?.includes('/static') &&
      process.env.NODE_ENV === 'production'
      ? `${basePath}${layerURL}`
      : layerURL;
  };

  const { url: layerURL, onClick: onClickString, ...layerProps } = layer;

  const mapLayer = {
    ...layerProps,
    onClick: getOnClickFn(onClickString),
    url: getLayerURL(layerURL)
  };
  return (
    <MapView
      layer={mapLayer}
      {...mapProps}
    />
  );
};

const ChartDisplay = () => {
  const {
    isRaw,
    rawConfig: rawOptions,
    defaultConfig,
    isEdited,
    mapConfig,
    isMap
  } = useChartContext();
  const { selectedChartType } = useDisplayContext();

  const props = useMemo(() => {
    const rawConfig = rawOptions?.[selectedChartType] || {};
    if (isRaw) {
      return { rawConfig };
    }
    let res = { ...defaultConfig };
    if (!basicChart.includes(selectedChartType)) {
      res = {
        ...res,
        data: isEdited ? res.data : stackChartExampleData
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
  }, [isRaw, defaultConfig, selectedChartType, rawOptions, isEdited]);

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
        return <MapDisplay {...mapConfig} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${isMap ? '' : 'pt-10'} h-2/3`}>{chartComponent()}</div>
  );
};

export default ChartDisplay;
