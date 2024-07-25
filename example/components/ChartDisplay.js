'use client';
import AkvoCharts from 'akvo-charts';
import { useChartContext } from '../context/ChartContextProvider';

const ChartDisplay = () => {
  const chartData = useChartContext();
  return (
    <>
      <AkvoCharts text={chartData?.title} />
    </>
  );
};

export default ChartDisplay;
