# Akvo Charts

Echarts Wrapper for React Component

[![NPM](https://img.shields.io/npm/v/akvo-charts.svg)](https://www.npmjs.com/package/akvo-charts) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

---

## Install
To get started, install the package via npm or yarn:

```bash
npm install --save akvo-charts
# or
yarn add akvo-charts
```
---

## API

### Config

| Prop	| Description |	Type | Default |
|-------|-------------|------|---------|
| `title`	| A string representing the title of the chart. | string | - |
| `xAxisLabel`	|	A string that specifies the label text for the X axis of the chart. This helps to describe the data represented along the X axis. This prop is applicable **only for Bar and Line charts**. | string | - |
| `yAxisLabel`	|	A string that specifies the label text for the Y axis of the chart. This helps to describe the data represented along the Y axis. This prop is applicable **only for Bar and Line charts**. | string | - |

**Example Config:**

```jsx
const config = {
  title: 'Akvo Chart',
  xAxisLabel: 'Year',
  yAxisLabel: 'Income',
}
```

### Data

In Akvo-Charts, we follow the [ECharts dataset format](https://echarts.apache.org/en/option.html#dataset.source) to ensure compatibility and ease of use. The following data formats are supported:

#### 2D Array

A 2D array where the first row and/or column can contain dimension names. If dimension names are not provided, only the data will be used. This format is useful for simple tabular data representations.

**Example:**

```jsx
[
    ['product', '2015', '2016', '2017'],
    ['Matcha Latte', 43.3, 85.8, 93.7],
    ['Milk Tea', 83.1, 73.4, 55.1],
    ['Cheese Cocoa', 86.4, 65.2, 82.5],
    ['Walnut Brownie', 72.4, 53.9, 39.1]
]
```

#### Row-Based Key-Value Format

An array of objects where each object represents a row of data. The keys in the objects correspond to dimension names, and the values represent the data points. This format is useful for datasets with named dimensions.

**Example:**

```jsx
[
    { product: 'Matcha Latte', count: 823, score: 95.8 },
    { product: 'Milk Tea', count: 235, score: 81.4 },
    { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
    { product: 'Walnut Brownie', count: 988, score: 76.9 }
]
```


#### Column-Based Key-Value Format

An object where each key represents a column of data. The values for each key are arrays that correspond to the data in each column. This format is useful for datasets where columns are explicitly defined.

**Example:**

```jsx
{
    'product': ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
    'count': [823, 235, 1042, 988],
    'score': [95.8, 81.4, 91.2, 76.9]
}

```

---

## Usage

### Bar or Line Chart
A component for rendering bar or line chart.

#### Props:

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `horizontal` |	boolean	| If `true`, the chart will be rendered with horizontal bars (optional). |

**Example usage of Bar chart:**

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
    title: 'Monthly Sales',
    xAxisLabel: 'Month',
    yAxisLabel: 'Sales'
  };

  return <Bar config={config} data={data} />;
};

export default BarChartExample;
```

### Pie Chart
A component for rendering pie chart.

#### Props:

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |

**Example usage of Pie chart:**

```jsx
import React from 'react';
import { Pie } from 'akvo-charts';

const PieChartExample = () => {
  const data = [
    { label: 'A', value: 30 },
    { label: 'B', value: 70 },
    // ...
  ];

  const config = {
    title: 'Market Share'
  };

  return <Pie config={config} data={data} />;
};

export default PieChartExample;
```


### Doughnut Chart
A component for rendering doughnut chart.

#### Props:

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config). |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `size` | number | The size of the doughnut chart's torus (optional). This value determines the radius of the inner circle of the doughnut chart, affecting the overall appearance and size of the chart. |

**Example usage of Doughnut chart:**

```jsx
import React from 'react';
import { Doughnut } from 'akvo-charts';

const DoughnutChartExample = () => {
  const data = [
    { label: 'A', value: 30 },
    { label: 'B', value: 70 },
    // ...
  ];

  const config = {
    title: 'Market Share'
  };

  return <Doughnut config={config} data={data} size={50} />;
};

export default DoughnutChartExample;
```

---