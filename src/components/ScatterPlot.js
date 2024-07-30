import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';
import * as echarts from 'echarts';
import transformConfig from '../utils/transformConfig';

import styles from '../styles.module.css';

const getOptions = ({ data = [], symbolSize = 20 }) => {
  return {
    series: [
      {
        symbolSize,
        data: data.filter((d) => Array.isArray(d)),
        type: 'scatter'
      }
    ]
  };
};

const ScatterPlot = forwardRef(
  ({ config, data, symbolSize = 20, isTest = false }, ref) => {
    const chartRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getChartInstance: () => {
        return chartRef.current
          ? echarts.getInstanceByDom(chartRef.current)
          : null;
      }
    }));

    useEffect(() => {
      let chart;

      if (chartRef.current) {
        chart = isTest
          ? echarts.init(chartRef.current, 'light', {
              renderer: 'svg',
              width: 400,
              height: 400
            })
          : echarts.init(chartRef.current, 'light', { renderer: 'svg' });
        const options = {
          ...transformConfig({ ...config, symbolSize }),
          ...getOptions({ data })
        };
        chart.setOption(options);
      }

      return () => {
        if (chart) {
          chart.dispose();
        }
      };
    }, [config, data, isTest, symbolSize]);

    return (
      <div
        ref={chartRef}
        role="figure"
        className={styles.container}
        data-testid="scatter-plot"
      />
    );
  }
);

export default ScatterPlot;
