import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import transformConfig, { filterObjNullValue } from '../utils/transformConfig';
import normalizeData from '../utils/normalizeData';

const useECharts = ({ config = {}, data = [], getOptions = () => {} }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;

    if (chartRef.current) {
      setTimeout(() => {
        if (!chart && chartRef.current) {
          chart = echarts.init(chartRef.current);
        }

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
          delete config.itemStyle;
        }
        const overrideItemStyle = Object.keys(filterObjNullValue(itemStyle))
          .length
          ? { itemStyle: filterObjNullValue(itemStyle) }
          : {};
        // eol handle item style

        const { dimensions, source } = normalizeData(data);
        const transformedConfig = transformConfig({ ...config, dimensions });
        const options = {
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
        if (chart) {
          chart.setOption(options);
        }
      }, 0);
    }

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, [config, data, getOptions]);

  return chartRef;
};

export default useECharts;
