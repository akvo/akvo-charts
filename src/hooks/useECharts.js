import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const useECharts = ({ config = {}, data = [], getOptions = () => {} }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;

    if (chartRef.current) {
      setTimeout(() => {
        chart = echarts.init(chartRef.current);
        const options = getOptions({ config, data });
        chart.setOption(options);
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
