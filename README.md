# Akvo Charts

Echarts Wrapper for React Component

[![NPM](https://img.shields.io/npm/v/akvo-charts.svg)](https://www.npmjs.com/package/akvo-charts) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

To get started, install the package via npm or yarn:

```bash
npm install --save akvo-charts
# or
yarn add akvo-charts
```

## Usage

### Bar or Line Chart
A component for rendering bar or line chart.

#### Props:

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | `object` |	Configuration options for the chart. |
| `data` |	`array` |	Data to be displayed in the chart. |
| `horizontal` |	`boolean`	| If `true`, the chart will be rendered with horizontal bars (optional). |

#### Example:

```jsx
import React from 'react';
import { Bar } from 'akvo-charts';
// Please change Bar into Line if you want to use Line chart

const BarChartExample = () => {
  const data = [
    { label: 'January', value: 30 },
    { label: 'February', value: 20 },
    // ...
  ];

  const config = {
    title: 'Monthly Sales'
  };

  return <Bar config={config} data={data} horizontal={false} />;
};

export default BarChartExample;
```

### Pie or Donut Chart
A component for rendering pie or donut chart.

#### Props:

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | `object` |	Configuration options for the chart. |
| `data` |	`array` |	Data to be displayed in the chart. |
| type |	`string`	| Type of pie chart ('pie' or 'donut') (optional). |

#### Example:

```jsx
import React from 'react';
import { Pie } from 'your-package-name';

const PieChartExample = () => {
  const data = [
    { label: 'A', value: 30 },
    { label: 'B', value: 70 },
    // ...
  ];

  const config = {
    title: 'Market Share'
  };

  return <Pie config={config} data={data} type="pie" />;
};

export default PieChartExample;
```