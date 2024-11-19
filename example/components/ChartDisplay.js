'use client';

import { useMemo } from 'react';
import {
  Bar,
  Doughnut,
  Line,
  Map,
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
    chartConfig,
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
    let res = chartConfig?.[selectedChartType] || defaultConfig;
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
  }, [
    isRaw,
    defaultConfig,
    chartConfig,
    selectedChartType,
    rawOptions,
    isEdited
  ]);

  const dummyFnIcon = (cluster) => {
    const result = Object.values(
      mapConfig?.data?.reduce((acc, item) => {
        const { serviceLevel, color } = item;

        if (!acc[serviceLevel]) {
          acc[serviceLevel] = { value: serviceLevel, color, count: 0 };
        }
        acc[serviceLevel].count++;

        return acc;
      }, {})
    );
    const totalValue = result.reduce((s, { count }) => s + count, 0);
    const radius = 40;
    const circleLength = Math.PI * (radius * 2);
    let spaceLeft = circleLength;
    return {
      html: `<svg width="100%" height="100%" viewBox="0 0 100 100"> <circle cx="50" cy="50" r="40" fill="#ffffffad"/>
            ${result
              .map((item, index) => {
                const v = index === 0 ? circleLength : spaceLeft;
                spaceLeft -= (item.count / totalValue) * circleLength;
                return `
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke-width="15" stroke="${
                    item.color ? item.color : 'red'
                  }" stroke-dasharray="${v} ${circleLength}" />`;
              })
              .join(
                ''
              )} <text x="50%" y="50%" fill="black" text-anchor="middle" dy=".3em" font-size="18px">${cluster.getChildCount()}</text></svg>`,
      className: `custom-marker-cluster`,
      iconSize: 60
    };
  };

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
      case chartTypes.CHOROPLETH_MAP:
        return <MapDisplay {...mapConfig} />;
      case chartTypes.CLUSTER_MAP:
        return (
          <Map.View {...mapConfig}>
            <Map.MarkerClusterGroup fnIcon={dummyFnIcon}>
              {mapConfig?.data
                ?.filter((d) => d?.point)
                ?.map((d, dx) => (
                  <Map.Marker
                    latlng={d?.point}
                    key={dx}
                    icon={{
                      className: 'custom-marker',
                      iconSize: [32, 32],
                      html: `<span style="background-color:${d?.color}; border:2px solid #fff;"/>`
                    }}
                  >
                    <ul className="w-full text-base space-y-1">
                      <li className="w-full flex flex-wrap items-center gap-1">
                        <strong>School: </strong>
                        <span>{d?.label}</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <strong>Service Level: </strong>
                        <span>{d?.serviceLevel}</span>
                      </li>
                    </ul>
                  </Map.Marker>
                ))}
            </Map.MarkerClusterGroup>
          </Map.View>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${isMap ? '' : 'pt-10'} h-full lg:h-[90vh] chart-display`}>
      {chartComponent()}
    </div>
  );
};

export default ChartDisplay;
