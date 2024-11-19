export const chartTypes = {
  BAR: 'Bar',
  LINE: 'Line',
  PIE: 'Pie',
  DOUGHNUT: 'Doughnut',
  STACK_BAR: 'StackBar',
  STACK_CLUSTER: 'StackClusterColumn',
  SCATTER_PLOT: 'ScatterPlot',
  STACK_LINE: 'StackLine',
  MAP: 'MapView',
  CHOROPLETH_MAP: 'MapViewChoropleth',
  CLUSTER_MAP: 'MapViewCluster'
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

export const choroplethExampleData = [
  {
    Propinsi: 'DI. ACEH',
    density: 92
  },
  {
    Propinsi: 'SUMATERA UTARA',
    density: 205
  },
  {
    Propinsi: 'SUMATERA BARAT',
    density: 133
  },
  {
    Propinsi: 'RIAU',
    density: 75
  },
  {
    Propinsi: 'JAMBI',
    density: 72
  },
  {
    Propinsi: 'SUMATERA SELATAN',
    density: 93
  },
  {
    Propinsi: 'BENGKULU',
    density: 102
  },
  {
    Propinsi: 'LAMPUNG',
    density: 262
  },
  {
    Propinsi: 'BANGKA BELITUNG',
    density: 90
  },
  {
    Propinsi: 'KEPULAUAN RIAU',
    density: 258
  },
  {
    Propinsi: 'DKI JAKARTA',
    density: 15978
  },
  {
    Propinsi: 'JAWA BARAT',
    density: 1379
  },
  {
    Propinsi: 'JAWA TENGAH',
    density: 1120
  },
  {
    Propinsi: 'DAERAH ISTIMEWA YOGYAKARTA',
    density: 1185
  },
  {
    Propinsi: 'JAWA TIMUR',
    density: 855
  },
  {
    Propinsi: 'BANTEN',
    density: 1248
  },
  {
    Propinsi: 'BALI',
    density: 755
  },
  {
    Propinsi: 'NUSATENGGARA BARAT',
    density: 290
  },
  {
    Propinsi: 'NUSA TENGGARA TIMUR',
    density: 111
  },
  {
    Propinsi: 'KALIMANTAN BARAT',
    density: 37
  },
  {
    Propinsi: 'KALIMANTAN TENGAH',
    density: 18
  },
  {
    Propinsi: 'KALIMANTAN SELATAN',
    density: 106
  },
  {
    Propinsi: 'KALIMANTAN TIMUR',
    density: 30
  },
  {
    Propinsi: 'KALIMANTAN UTARA',
    density: 9
  },
  {
    Propinsi: 'SULAWESI UTARA',
    density: 190
  },
  {
    Propinsi: 'SULAWESI TENGAH',
    density: 49
  },
  {
    Propinsi: 'SULAWESI SELATAN',
    density: 196
  },
  {
    Propinsi: 'SULAWESI TENGGARA',
    density: 70
  },
  {
    Propinsi: 'GORONTALO',
    density: 105
  },
  {
    Propinsi: 'SULAWESI BARAT',
    density: 86
  },
  {
    Propinsi: 'MALUKU',
    density: 40
  },
  {
    Propinsi: 'MALUKU UTARA',
    density: 41
  },
  {
    Propinsi: 'PAPUA BARAT',
    density: 11
  },
  {
    Propinsi: 'PAPUA',
    density: 14
  }
];

export const choroplethExampleColor = [
  '#FFEDA0',
  '#FED976',
  '#FEB24C',
  '#FC4E2A',
  '#FD8D3C',
  '#E31A1C',
  '#BD0026',
  '#800026'
];

export const basePath = '/akvo-charts';

export const clusterExampleData = [
  {
    point: [-6.2251619, 106.714291],
    label: 'SMP Negeri 115 Jakarta',
    serviceLevel: 'No service',
    color: '#febc11'
  },
  {
    point: [-6.192708, 106.8393836],
    label: 'Junior High School State 1 of JAKARTA',
    serviceLevel: 'Limited',
    color: '#fff176'
  },
  {
    point: [-6.120255, 106.871146],
    label: 'JUNIOR HIGH SCHOOL STATE 55 OF JAKARTA',
    serviceLevel: 'Basic',
    color: '#00b8ec'
  },
  {
    point: [-6.2400094, 106.789988],
    label: 'SMPN 11 JAKARTA',
    serviceLevel: 'Basic',
    color: '#00b8ec'
  }
];
