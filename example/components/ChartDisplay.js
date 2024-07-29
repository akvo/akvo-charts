'use client';
import { Bar } from 'akvo-charts';
import { useChartContext } from '../context/ChartContextProvider';

const ChartDisplay = () => {
  const { isRaw, rawConfig, defaultConfig } = useChartContext();
  const chartData = isRaw ? rawConfig : defaultConfig;

  const data = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 30 }
  ];

  const config = {
    title: 'Bar Chart Example',
    xAxisLabel: 'Categories',
    yAxisLabel: 'Values'
  };

  return (
    <>
      <Bar
        config={config}
        data={data}
      />
    </>
  );
};

export default ChartDisplay;
