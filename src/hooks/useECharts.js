import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import transformConfig, { filterObjNullValue } from '../utils/transformConfig';
import normalizeData from '../utils/normalizeData';
import { resolveToolbox } from '../utils/toolbox';

const useECharts = ({
  config = {},
  data = [],
  getOptions = () => {},
  rawConfig = {},
  rawOverrides = {}
}) => {
  const chartRef = useRef(null);
  const appliedRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null); // State to store the ECharts instance

  useEffect(() => {
    if (!chartInstance && chartRef.current) {
      const initProps =
        config?.width && config?.height
          ? { width: config.width, height: config.height }
          : {};
      const chart = echarts.init(chartRef.current, config?.theme || null, {
        renderer: config?.renderer || 'canvas',
        ...initProps
      });
      setChartInstance(chart);
    }

    let options = {};

    if (!Object.keys(rawConfig).length) {
      // handle horizontal
      let horizontal = false;
      if (config?.horizontal) {
        horizontal = config.horizontal;
      }
      // eol handle horizontal

      // handle itemStyle
      let itemStyle = {
        color: null,
        borderColor: null,
        borderWidth: null,
        borderType: null,
        opacity: null
      };
      if (config?.itemStyle) {
        itemStyle = { ...config.itemStyle };
      }
      const overrideItemStyle = Object.keys(filterObjNullValue(itemStyle))
        .length
        ? { itemStyle: filterObjNullValue(itemStyle) }
        : {};
      // eol handle item style

      const { dimensions, source } = normalizeData(data);
      const transformedConfig = transformConfig({
        ...config,
        dimensions
      });
      options = {
        ...transformedConfig,
        dataset: {
          dimensions,
          source
        },
        ...getOptions({
          dimensions,
          transformedConfig,
          overrideItemStyle,
          horizontal
        })
      };

      // Built from the merged dataset, not from normalizeData: ScatterPlot
      // replaces dataset.source with its own transform, so anything built
      // earlier would export the wrong rows.
      const toolbox = resolveToolbox({
        toolbox: config?.toolbox,
        chartType: rawOverrides?.type,
        showAxis: config?.showAxis !== false,
        dataset: options.dataset,
        title: config?.title
      });
      if (toolbox) {
        options = { ...options, toolbox };
      }
    } else {
      // Handle raw config
      options = rawConfig?.series
        ? {
            ...rawConfig,
            series: rawConfig.series.map((s) => ({
              ...rawOverrides,
              ...s,
              type: rawOverrides?.type || s?.type
            }))
          }
        : rawConfig;
    }

    if (chartInstance) {
      // config-path options are pure data plus two functions this library owns
      // and that never vary, so omitting functions from the signature loses
      // nothing. rawConfig may hold consumer formatters closing over their own
      // state, where a stale skip would be a real regression - so it always
      // re-applies, as before.
      const isRaw = Boolean(Object.keys(rawConfig).length);
      const signature = isRaw
        ? null
        : JSON.stringify(options, (key, value) =>
            typeof value === 'function' ? undefined : value
          );

      if (isRaw || signature !== appliedRef.current) {
        appliedRef.current = signature;
        try {
          // notMerge, not clear() + setOption. Both replace the option wholesale,
          // but clear() is itself setOption({series: []}, true), which would make
          // that empty option the instance's FIRST one - and ECharts' `restore`
          // recreates from the first option it ever saw, so restore would blank
          // the chart.
          chartInstance.setOption(options, { notMerge: true });
        } catch (err) {
          console.error('useECharts', err);
        }
      }
    }
  }, [
    chartInstance,
    chartRef,
    config,
    rawConfig,
    data,
    rawOverrides,
    getOptions
  ]);

  return [chartRef, chartInstance];
};

export default useECharts;
