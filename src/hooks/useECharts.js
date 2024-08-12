import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import transformConfig, { filterObjNullValue } from '../utils/transformConfig';
import normalizeData from '../utils/normalizeData';

const useECharts = ({
  config = {},
  data = [],
  getOptions = () => {},
  rawConfig = {}
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    let options = {};

    if (chartRef.current) {
      setTimeout(() => {
        if (!chart && chartRef.current) {
          chart = echarts.init(chartRef.current);

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
          } else {
            // Handle raw config
            options = { ...rawConfig };
          }

          if (chart) {
            chart.setOption(options);
          }
        }
      }, 0);
    }

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, [config, rawConfig, data, getOptions]);

  return chartRef;
};

export default useECharts;
