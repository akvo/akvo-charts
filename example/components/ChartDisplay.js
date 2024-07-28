'use client';
import AkvoCharts from 'akvo-charts';
import { useChartContext } from '../context/ChartContextProvider';

const ChartDisplay = () => {
  const { isRaw, rawConfig, defaultConfig } = useChartContext();
  const chartData = isRaw ? rawConfig : defaultConfig;
  return (
    <>
      <AkvoCharts text={chartData?.title} />
    </>
  );
};

export default ChartDisplay;
