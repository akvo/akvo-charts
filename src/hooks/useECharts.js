import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import transformConfig from '../utils/transformConfig';
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
        const { dimensions, source } = normalizeData(data);
        const options = {
          ...transformConfig({ ...config, dimensions }),
          dataset: {
            dimensions,
            source
          },
          ...getOptions({ dimensions })
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
