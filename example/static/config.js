export const chartTypes = {
  BAR: 'Bar',
  LINE: 'Line',
  PIE: 'Pie',
  DOUGHNUT: 'Doughnut',
  STACK_BAR: 'StackBar',
  STACK_CLUSTER: 'StackClusterColumn',
  SCATTER_PLOT: 'ScatterPlot',
  STACK_LINE: 'StackLine'
};

export const excludeHorizontal = [
  chartTypes.PIE,
  chartTypes.DOUGHNUT,
  chartTypes.SCATTER_PLOT
];
export const basicChart = [
  chartTypes.BAR,
  chartTypes.LINE,
  chartTypes.PIE,
  chartTypes.DOUGHNUT,
  chartTypes.SCATTER_PLOT
];
export const excludeStackMapping = [
  ...basicChart,
  chartTypes.STACK_CLUSTER,
  chartTypes.STACK_LINE
];

export const basicChartExampleData = [
  { product: 'Product 1', sales: 30 },
  { product: 'Product 2', sales: 20 },
  { product: 'Product 3', sales: 50 },
  { product: 'Product 4', sales: 45 },
  { product: 'Product 5', sales: 40 }
];

export const stackChartExampleData = [
  {
    product: 'Product A',
    2018: 12000,
    2019: 15000,
    2020: 18000,
    2021: 20000,
    2022: 22000,
    2023: 25000
  },
  {
    product: 'Product B',
    2018: 8000,
    2019: 9500,
    2020: 11000,
    2021: 13000,
    2022: 14000,
    2023: 16000
  },
  {
    product: 'Product C',
    2018: 15000,
    2019: 16000,
    2020: 17000,
    2021: 19000,
    2022: 21000,
    2023: 23000
  },
  {
    product: 'Product D',
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

export const scatterPlotExampleData = [
  { label: 'Product 1', x: 1, y: 30 },
  { label: 'Product 2', x: 2, y: 20 },
  { label: 'Product 3', x: 3, y: 50 },
  { label: 'Product 4', x: 4, y: 45 },
  { label: 'Product 5', x: 5, y: 40 }
];
