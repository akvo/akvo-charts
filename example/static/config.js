export const chartTypes = {
  BAR: 'Bar',
  LINE: 'Line',
  PIE: 'Pie',
  DOUGHNUT: 'Doughnut',
  STACK_BAR: 'StackBar',
  STACK_CLUSTER: 'StackClusterColumn'
};

export const excludeHorizontal = [chartTypes.PIE, chartTypes.DOUGHNUT];
export const basicChart = [
  chartTypes.BAR,
  chartTypes.LINE,
  chartTypes.PIE,
  chartTypes.DOUGHNUT
];
export const excludeStackMapping = [...basicChart, chartTypes.STACK_CLUSTER];

export const basicChartExampleData = [
  { month: 'Product 1', totalSales: 30 },
  { month: 'Product 2', totalSales: 20 },
  { month: 'Product 3', totalSales: 50 },
  { month: 'Product 4', totalSales: 45 },
  { month: 'Product 5', totalSales: 40 }
];

export const stackChartExampleData = [
  {
    productName: 'Product A',
    2018: 12000,
    2019: 15000,
    2020: 18000,
    2021: 20000,
    2022: 22000,
    2023: 25000
  },
  {
    productName: 'Product B',
    2018: 8000,
    2019: 9500,
    2020: 11000,
    2021: 13000,
    2022: 14000,
    2023: 16000
  },
  {
    productName: 'Product C',
    2018: 15000,
    2019: 16000,
    2020: 17000,
    2021: 19000,
    2022: 21000,
    2023: 23000
  },
  {
    productName: 'Product D',
    2018: 5000,
    2019: 7000,
    2020: 9000,
    2021: 12000,
    2022: 15000,
    2023: 18000
  }
];

export const exampleStackMapping = {
  group1: ['2018', '2019'],
  group2: ['2020', '2021'],
  group3: ['2022', '2023']
};
