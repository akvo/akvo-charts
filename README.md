# Akvo Charts

Echarts Wrapper for React Component

[![NPM](https://img.shields.io/npm/v/akvo-charts.svg)](https://www.npmjs.com/package/akvo-charts) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

---

# Table of Contents

- [Akvo Charts](#akvo-charts)
- [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [API](#api)
    - [Config](#config)
      - [Legend](#legend)
      - [Text Style](#text-style)
    - [Data](#data)
      - [2D Array](#2d-array)
      - [Row-Based Key-Value Format](#row-based-key-value-format)
      - [Column-Based Key-Value Format](#column-based-key-value-format)
  - [Usage](#usage)
    - [Bar Chart](#bar-chart)
      - [Props](#props)
      - [Example usage of Bar chart](#example-usage-of-bar-chart)
    - [Line Chart](#line-chart)
      - [Props](#props-1)
      - [Example usage of Line chart](#example-usage-of-line-chart)
    - [Pie Chart](#pie-chart)
      - [Props](#props-2)
      - [Example usage of Pie chart](#example-usage-of-pie-chart)
    - [Doughnut Chart](#doughnut-chart)
      - [Props](#props-3)
      - [Example usage of Doughnut chart](#example-usage-of-doughnut-chart)
    - [Stack Bar Chart](#stack-bar-chart)
      - [Props](#props-4)
      - [Example of stackMapping props](#example-of-stackmapping-props)
      - [Example usage of StackBar chart](#example-usage-of-stackbar-chart)
    - [Stack Cluster Column](#stack-cluster-column)
      - [Props](#props-5)
      - [Example usage of StackClusterColumn chart](#example-usage-of-stackclustercolumn-chart)
    - [Scatter Plot Chart](#scatter-plot-chart)
      - [Props](#props-6)
      - [Example usage of ScatterPlot chart](#example-usage-of-scatterplot-chart)
    - [Stack Line Chart](#stack-line-chart)
      - [Props](#props-7)
      - [Example usage of StackLine chart](#example-usage-of-stackline-chart)

---

## Installation
To get started, install the package via npm:

```bash
npm install --save akvo-charts
```
or yarn:
```bash
yarn add akvo-charts
```
---

## API

### Config

| Prop	| Description |	Type | Default |
|-------|-------------|------|---------|
| `title`	| A string representing the title of the chart. | string | - |
| `subtitle`	| A string representing the subtitle of the chart. | string | - |
| `xAxisLabel`	|	A string that specifies the label text for the X axis of the chart. This helps to describe the data represented along the X axis. This prop is applicable **only for Bar and Line charts**. | string | - |
| `yAxisLabel`	|	A string that specifies the label text for the Y axis of the chart. This helps to describe the data represented along the Y axis. This prop is applicable **only for Bar and Line charts**. | string | - |
| `legend`	| An object that specifies the legend style for the chart. For detailed configuration options, refer to the [Legend Section](#legend). | object | None |
| `textStyle` | An object that specifies the general text style options for the entire chart. This textStyle configuration will override all individual text styles within the chart. For detailed configuration options, refer to the [Text Style Section](#text-style). | object | None |
| `color`	| An array that specifies the color list of palette. If no color is set in series, the colors would be adopted sequentially and circularly from this list as the colors of series. | array | `['#4475B4', '#73ADD1', '#AAD9E8', '#FEE08F', '#FDAE60', '#F36C42', '#D73027']` |

#### Legend

| Prop	| Description |	Type | Default |
|-------|-------------|------|---------|
| `show`	| Option to show/hide the legend. |	boolean | `true` |
| `icon`	| Icon of the legend items. Options are: `'circle'`, `'rect'`, `'roundRect'`, `'triangle'`, `'diamond'`, `'pin'`, `'arrow'`, `'none'`. |	string | `circle` |
| `top`	| Distance between legend component and the top side of the container. `top` can be a pixel value like `20`, it can also be a percentage value relative to container width like `'20%'`, and it can also be `'top'`, `'middle'`, or `'bottom'`. If the top value is set to be `'top'`, `'middle'`, or `'bottom'`, then the component will be aligned automatically based on position. |	string \| number | `35` |
| `left`	| Distance between legend component and the left side of the container. `left` can be a pixel value like `20`, it can also be a percentage value relative to container width like `'20%'`, and it can also be `'left'`, `'center'`, or `'right'`. If the left value is set to be `'left'`, `'center'`, or `'right'`, then the component will be aligned automatically based on position. |	string \| number | `'center'` |
| `align`	| Legend marker and text aligning. Options are: `'auto'`, `'left'`, `'right'`. |	string | `'left'` |
| `orient`	| The layout orientation of legend. Options are: `'horizontal'`, `'vertical'`. |	string | `'horizontal'` |
| `itemGap`	| The distance between each legend, horizontal distance in horizontal layout, and vertical distance in vertical layout. |	number | `10` |

**Example of `legend` config**

```javascript
const config = {
  // ...other config
  legend: {
    show: true,
    icon: 'pin',
    top: 40,
    left: 'left',
    align: 'left',
    orient: 'vertical',
    itemGap: 15
  }
}
```

#### Text Style

| Prop	| Description |	Type | Default |
|-------|-------------|------|---------|
| `color`	| The color of the text. |	hexa | `#000` |
| `fontStyle`	| The font style of the text. Options are: `'normal'`, `'italic'`, `'oblique'`. |	string | None |
| `fontWeight`	| The font thick weight of the text. Options are: `'normal'`, `'bold'`, `'bolder'`, `'lighter'`, `100 \| 200 \| 200 \| 400...`. |	string \| number | None |
| `fontFamily`	| The font family of the text. |	string | `sans-serif` |
| `fontSize`	| The font size of the text. |	number | None |

**Example of `textStyle` config**

```javascript
const config = {
  // ...other config
  textStyle: {
    color: '#000100',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: 12
  }
}
```

**Example Config**

```jsx
const config = {
  title: 'Akvo Chart',
  xAxisLabel: 'Year',
  yAxisLabel: 'Income',
  legend: {
    show: true,
    icon: 'pin',
    top: 40,
    left: 'left',
    align: 'left',
    orient: 'vertical',
    itemGap: 15
  },
  textStyle: {
    color: '#000100',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: 12
  },
  color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
}
```

### Data

In Akvo-Charts, we follow the [ECharts dataset format](https://echarts.apache.org/en/option.html#dataset.source) to ensure compatibility and ease of use. The following data formats are supported:

#### 2D Array

A 2D array where the first row and/or column can contain dimension names. If dimension names are not provided, only the data will be used. This format is useful for simple tabular data representations.

**Example**

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

**Example**

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

**Example**

```jsx
{
    'product': ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
    'count': [823, 235, 1042, 988],
    'score': [95.8, 81.4, 91.2, 76.9]
}

```

---

## Usage

### Bar Chart
A component for rendering basic bar chart.

#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `horizontal` _(optional)_ |	boolean	| If `true`, the chart will be rendered with horizontal bars. The default value is `false`. |

#### Example usage of Bar chart

```jsx
import React from 'react';
import { Bar } from 'akvo-charts';

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

### Line Chart
A component for rendering basic line chart.

#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `horizontal` _(optional)_ |	boolean	| If `true`, the chart will be rendered with horizontal bars. The default value is `false`. |

 #### Example usage of Line chart

```jsx
import React from 'react';
import { Line } from 'akvo-charts';

const LineChartExample = () => {
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

  return <Line config={config} data={data} />;
};

export default LineChartExample;
```

### Pie Chart
A component for rendering basic pie chart.

#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |

#### Example usage of Pie chart

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
A component for rendering basic doughnut chart.

#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config). |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `size` | number | The size of the doughnut chart's torus (optional). This value determines the radius of the inner circle of the doughnut chart, affecting the overall appearance and size of the chart. |

#### Example usage of Doughnut chart

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

### Stack Bar Chart

A component for rendering stacked bar chart.


#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `horizontal` _(optional)_ |	boolean	| If `true`, the chart will be rendered with horizontal bars. The default value is `false`. |
| stackMapping _(optional)_ | object | Configuration object for defining the stack groups in a stack bar chart. If not provided, all series will be rendered in a single stack. Refer to the [Example of stackMapping props](#example-of-stackmapping-props) for detailed usage. |

#### Example of stackMapping props

```jsx
const data = [
    ['product', '2015', '2016', '2017', '2018'],
    ['Matcha Latte', 43.3, 85.8, 93.7, 90],
    ['Milk Tea', 83.1, 73.4, 55.1, 78],
    ['Cheese Cocoa', 86.4, 65.2, 82.5, 44.3],
    ['Walnut Brownie', 72.4, 53.9, 39.1, 55.5]
];

const stackMapping = {
  'stack1': [2015, 2016],
  'stack2': [2017, 2018],
}
```


#### Example usage of StackBar chart

```jsx
import React from 'react';
import { StackBar } from 'akvo-charts';

const StackBarChartExample = () => {
  const data = [
      ['product', '2015', '2016', '2017', '2018'],
      ['Matcha Latte', 43.3, 85.8, 93.7, 90],
      ['Milk Tea', 83.1, 73.4, 55.1, 78],
      ['Cheese Cocoa', 86.4, 65.2, 82.5, 44.3],
      ['Walnut Brownie', 72.4, 53.9, 39.1, 55.5]
  ];

  const stackMapping = {
    'stack1': [2015, 2016],
    'stack2': [2017, 2018],
  }

  const config = {
    title: 'Product Sales Stack Bar',
    xAxisLabel: 'Product',
    yAxisLabel: 'Sales'
  };

  return <StackBar config={config} data={data} stackMapping={stackMapping} />;
};

export default StackBarChartExample;
```


### Stack Cluster Column

A component for rendering stakc cluster column. Basically this chart is like stack bar chart but stacked into a group of bar chart.


#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `horizontal` _(optional)_ |	boolean	| If `true`, the chart will be rendered with horizontal bars. The default value is `false`. |


#### Example usage of StackClusterColumn chart

```jsx
import React from 'react';
import { StackClusterColumn } from 'akvo-charts';

const StackClusterColumnChartExample = () => {
  const data = [
      ['product', '2015', '2016', '2017', '2018'],
      ['Matcha Latte', 43.3, 85.8, 93.7, 90],
      ['Milk Tea', 83.1, 73.4, 55.1, 78],
      ['Cheese Cocoa', 86.4, 65.2, 82.5, 44.3],
      ['Walnut Brownie', 72.4, 53.9, 39.1, 55.5]
  ];

  const config = {
    title: 'Product Sales Stack Bar',
    xAxisLabel: 'Product',
    yAxisLabel: 'Sales'
  };

  return <StackClusterColumn config={config} data={data} />;
};

export default StackClusterColumnChartExample;
```

### Scatter Plot Chart

A component for rendering basic scatter plot chart.

#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config). |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `symbolSize` _(optional)_| number |Optional parameter to set the dot size. The default value is `10`|
| `showLabel` _(optional)_| boolean |Optional parameter to set the dot size. The default value is `true`|


#### Example usage of ScatterPlot chart

```jsx
import React from 'react';
import { ScatterPlot } from 'akvo-charts';

const ScatterPlotChartExample = () => {
   const data = [
      { label: 'A', x: 1, y: 2 },
      { label: 'B', x: 1, y: 3 },
      { label: 'C', x: 5, y: 7 }
    ];

    const config = {
      title: 'ScatterPlot Chart Example'
    };

  return <ScatterPlot config={config} data={data} symbolSize={25} />;
};

export default ScatterPlotChartExample;
```

### Stack Line Chart

A component for rendering stack line chart.

#### Props

| Prop	| Type |	Description |
|-------|------|--------------|
| `config` | object |	Configuration options for the chart. For detailed information on the available configuration options, see the [Config Section](#config).  |
| `data` |	array |	Data to be displayed in the chart. For more details on the data format, see the [Data Section](#data). |
| `horizontal` _(optional)_ |	boolean	| If `true`, the chart will be rendered with horizontal bars. The default value is `false`. |


#### Example usage of StackLine chart

```jsx
import React from 'react';
import { StackLine } from 'akvo-charts';

const StackLineChartExample = () => {
  const data = [
      ['product', '2015', '2016', '2017', '2018'],
      ['Matcha Latte', 43.3, 85.8, 93.7, 90],
      ['Milk Tea', 83.1, 73.4, 55.1, 78],
      ['Cheese Cocoa', 86.4, 65.2, 82.5, 44.3],
      ['Walnut Brownie', 72.4, 53.9, 39.1, 55.5]
  ];

  const config = {
    title: 'Product Sales Stack Bar',
    xAxisLabel: 'Product',
    yAxisLabel: 'Sales'
  };

  return <StackLine config={config} data={data} />;
};

export default StackLineChartExample;
```

---