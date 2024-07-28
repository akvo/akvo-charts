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
| `horizontal`	|	A boolean value that, when set to `true`, renders the chart with horizontal bars or lines. This prop is applicable **only for Bar and Line charts**. | boolean | `false` |

**Example Config:**

```jsx
const config = {
  title: 'Akvo Chart',
  xAxisLabel: 'Year',
  yAxisLabel: 'Income',
  horizontal: false,
}
```

### Data

Each component's `data` prop expects an array of objects with the following structure:

| Prop    | Description                          |  Type   | Default |
|---------|--------------------------------------|---------|---------|
| `label` | The label for the data point. This will be displayed on the x-axis (for Bar and Line chart) or as the segment label (for Pie chart). | string | - |
| `value` | The value for the data point. This will determine the height of the bar (for Bar chart), the position of the point (for Line chart), or the size of the segment (for Pie chart). | number | - |

**Example Data:**

```jsx
const data = [
  { label: 'January', value: 30 },
  { label: 'February', value: 20 },
  { label: 'March', value: 50 }
];
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