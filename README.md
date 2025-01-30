# Akvo Charts

The `akvo-charts` library allows you to create a variety of charts by leveraging [Apache ECharts](https://echarts.apache.org/en/index.html) configurations. In this documentation, we'll demonstrate how to use all the components from akvo-charts with custom configurations, using both the default config and the rawConfig prop, which directly maps to the ECharts options.

**Note:** In addition to chart components, `akvo-charts` also includes a `MapView` component that leverages [Leaflet](https://leafletjs.com/) for creating interactive maps. This provides a powerful combination of charting and mapping capabilities within a single library.

[![NPM](https://img.shields.io/npm/v/akvo-charts.svg)](https://www.npmjs.com/package/akvo-charts) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

---

# Table of Contents

- [Akvo Charts](#akvo-charts)
- [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [API](#api)
    - [Raw config](#raw-config)
    - [Config](#config)
      - [Legend](#legend)
      - [Text Style](#text-style)
      - [Item Style](#item-style)
      - [Example Config](#example-config)
    - [Data](#data)
      - [2D Array](#2d-array)
      - [Row-Based Key-Value Format](#row-based-key-value-format)
      - [Column-Based Key-Value Format](#column-based-key-value-format)
  - [Usage](#usage)
    - [Bar Chart](#bar-chart)
      - [Props](#props)
      - [Example usage of Bar chart](#example-usage-of-bar-chart)
      - [Example usage of `rawConfig` for a Bar chart](#example-usage-of-rawconfig-for-a-bar-chart)
    - [Line Chart](#line-chart)
      - [Props](#props-1)
      - [Example usage of Line chart](#example-usage-of-line-chart)
      - [Example usage of `rawConfig` for a Line chart](#example-usage-of-rawconfig-for-a-line-chart)
    - [Pie Chart](#pie-chart)
      - [Props](#props-2)
      - [Example usage of Pie chart](#example-usage-of-pie-chart)
      - [Example usage of `rawConfig` for a Pie chart](#example-usage-of-rawconfig-for-a-pie-chart)
    - [Doughnut Chart](#doughnut-chart)
      - [Props](#props-3)
      - [Example usage of Doughnut chart](#example-usage-of-doughnut-chart)
      - [Example usage of `rawConfig` for a Doughnut chart](#example-usage-of-rawconfig-for-a-doughnut-chart)
    - [Stack Bar Chart](#stack-bar-chart)
      - [Props](#props-4)
      - [Example of stackMapping props](#example-of-stackmapping-props)
      - [Example usage of StackBar chart](#example-usage-of-stackbar-chart)
      - [Example usage of `rawConfig` for a StackBar chart](#example-usage-of-rawconfig-for-a-stackbar-chart)
    - [Stack Cluster Column](#stack-cluster-column)
      - [Props](#props-5)
      - [Example usage of StackClusterColumn chart](#example-usage-of-stackclustercolumn-chart)
      - [Example usage of `rawConfig` for a StackClusterColumn chart](#example-usage-of-rawconfig-for-a-stackclustercolumn-chart)
    - [Scatter Plot Chart](#scatter-plot-chart)
      - [Props](#props-6)
      - [Example usage of ScatterPlot chart](#example-usage-of-scatterplot-chart)
      - [Example usage of `rawConfig` for a ScatterPlot chart](#example-usage-of-rawconfig-for-a-scatterplot-chart)
    - [Stack Line Chart](#stack-line-chart)
      - [Props](#props-7)
      - [Example usage of StackLine chart](#example-usage-of-stackline-chart)
      - [Example usage of `rawConfig` for a StackLine chart](#example-usage-of-rawconfig-for-a-stackline-chart)
    - [MapView](#mapview)
      - [config](#config-1)
      - [layer](#layer)
        - [tooltip (object)](#tooltip-object)
      - [data](#data-1)
      - [config](#config-2)
      - [Example usage of MapView](#example-usage-of-mapview)
      - [Example Usage with Choropleth Mapping](#example-usage-with-choropleth-mapping)
    - [MapCluster](#mapcluster)
      - [Props](#props-8)
        - [`markerIcon`](#markericon)
        - [`clusterIcon`](#clustericon)
        - [Additional Properties](#additional-properties)
      - [Example Usage](#example-usage)
      - [MapCluster Notes](#mapcluster-notes)
    - [Fully Customized Map](#fully-customized-map)
    - [Components](#components)
      - [Container](#container)
      - [GeoJson](#geojson)
      - [LegendControl](#legendcontrol)
      - [Marker](#marker)
      - [MarkerClusterGroup](#markerclustergroup)
      - [TileLayer](#tilelayer)
      - [Utils](#utils)
      - [Example Usage](#example-usage-1)
      - [Map components Notes](#map-components-notes)
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

### Raw config

An object containing the chart configuration options that adhere to Apache ECharts' specifications. This allows you to customize various aspects of the chart, including axes, series, grid, and more. The structure of this object should follow the [ECharts option documentation](https://echarts.apache.org/en/option.html).


| Prop	| Type |	Description |
|-------|------|--------------|
| rawConfig | object | An object containing the chart configuration options that adhere to Apache ECharts' specifications. **When `rawConfig` is provided, it will override the default `data` and `config` props.** This allows you to customize various aspects of the chart, including axes, series, grid, and more. The structure of this object should follow the [ECharts option documentation](https://echarts.apache.org/en/option.html). |

### Config

| Prop	| Description |	Type | Default |
|-------|-------------|------|---------|
| `title`	| A string representing the title of the chart. | string | - |
| `subtitle`	| A string representing the subtitle of the chart. | string | - |
| `xAxisLabel`	|	A string that specifies the label text for the X axis of the chart. This helps to describe the data represented along the X axis. This prop is applicable **only for Bar and Line charts**. | string | - |
| `yAxisLabel`	|	A string that specifies the label text for the Y axis of the chart. This helps to describe the data represented along the Y axis. This prop is applicable **only for Bar and Line charts**. | string | - |
| `horizontal` _(optional)_ | If true, the chart will be rendered with horizontal bars. This option is **only applicable for Bar and Line chart** types. | boolean | `false` |
| `legend`	| An object that specifies the legend style for the chart. For detailed configuration options, refer to the [Legend Section](#legend). | object | None |
| `textStyle` | An object that specifies the general text style options for the entire chart. This textStyle configuration will override all individual text styles within the chart. For detailed configuration options, refer to the [Text Style Section](#text-style). | object | None |
| `itemStyle` | An object that defines the general styling options for items within the entire series in the chart. For more detailed configuration options, refer to the [Item Style Section](#item-style). | object | None |
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

#### Item Style

| Prop	| Description |	Type | Default |
|-------|-------------|------|---------|
| `color`	| Defines the color of the series. By default, colors from the global palette `color` configuration are used. |	string (hexa) | `auto` |
| `borderColor`	| Specifies the border color of the series. |	string (hexa) | `'#000'` |
| `borderWidth`	| Sets the width of the series border. Defaults to no border. | number | `0` |
| `borderType`	| Determines the type of border for the series. Options include `'solid'`, `'dashed'`, `'dotted'`. |	string | `solid` |
| `opacity`	| Adjusts the opacity of the component, supporting values from 0 to 1. The component will not be drawn when set to 0. |	number | `1` |

**Example of `itemStyle` config**

```javascript
const config = {
  // ...other config
  itemStyle: {
    color: '#5470c6',
    borderColor: '#fff',
    borderWidth: 1,
    borderType: 'dashed',
    opacity: 0.6
  }
}
```


#### Example Config

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
  itemStyle: {
    color: '#5470c6',
    borderColor: '#fff',
    borderWidth: 1,
    borderType: 'dashed',
    opacity: 0.6
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

#### Example usage of Bar chart

```jsx
import React from 'react';
import { Bar } from 'akvo-charts';
import 'akvo-charts/dist/index.css'

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

#### Example usage of `rawConfig` for a Bar chart

```jsx
import { Bar } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const BarChartExample = () => {
  const rawConfig = {
    xAxis: {
      type: "category",
      data: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [
          120,
          200,
          150,
          80,
          70,
          110,
          130
        ],
        type: "bar"
      }
    ]
  };

  return <Bar rawConfig={rawConfig} />;
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

 #### Example usage of Line chart

```jsx
import React from 'react';
import { Line } from 'akvo-charts';
import 'akvo-charts/dist/index.css'

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
#### Example usage of `rawConfig` for a Line chart

```jsx
import { Line } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const LineChartExample = () => {
  const rawConfig = {
    xAxis: {
      type: "category",
      data: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [
          820,
          932,
          901,
          934,
          1290,
          1330,
          1320
        ],
        type: "line",
        smooth: true
      }
    ]
  };

  return <Line rawConfig={rawConfig} />;
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
import 'akvo-charts/dist/index.css'

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

#### Example usage of `rawConfig` for a Pie chart

```jsx
import { Pie } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const PieChartExample = () => {
  const rawConfig = {
    title: {
      text: "Referer of a Website",
      subtext: "Fake Data",
      left: "center"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      left: "left"
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          {
            value: 1048,
            name: "Search Engine"
          },
          {
            value: 735,
            name: "Direct"
          },
          {
            value: 580,
            name: "Email"
          },
          {
            value: 484,
            name: "Union Ads"
          },
          {
            value: 300,
            name: "Video Ads"
          }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };

  return <Pie rawConfig={rawConfig} />;
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
import 'akvo-charts/dist/index.css'

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

#### Example usage of `rawConfig` for a Doughnut chart

```jsx
import { Doughnut } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const DoughnutChartExample = () => {
  const rawConfig = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "5%",
      left: "center"
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: [
          "40%",
          "70%"
        ],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 1048,
            name: "Search Engine"
          },
          {
            value: 735,
            name: "Direct"
          },
          {
            value: 580,
            name: "Email"
          },
          {
            value: 484,
            name: "Union Ads"
          },
          {
            value: 300,
            name: "Video Ads"
          }
        ]
      }
    ]
  };

  return <Doughnut rawConfig={rawConfig} />;
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
import 'akvo-charts/dist/index.css'

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

#### Example usage of `rawConfig` for a StackBar chart

```jsx
import { StackBar } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const StackBarChartExample = () => {
  const rawConfig = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        [
          "product",
          "2015",
          "2016",
          "2017"
        ],
        [
          "Matcha Latte",
          43.3,
          85.8,
          93.7
        ],
        [
          "Milk Tea",
          83.1,
          73.4,
          55.1
        ],
        [
          "Cheese Cocoa",
          86.4,
          65.2,
          82.5
        ],
        [
          "Walnut Brownie",
          72.4,
          53.9,
          39.1
        ]
      ]
    },
    xAxis: {
      type: "category"
    },
    yAxis: {},
    series: [
      {
        type: "bar"
      },
      {
        type: "bar"
      },
      {
        type: "bar"
      }
    ]
  };

  return <StackBar rawConfig={rawConfig} />;
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


#### Example usage of StackClusterColumn chart

```jsx
import React from 'react';
import { StackClusterColumn } from 'akvo-charts';
import 'akvo-charts/dist/index.css'

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

#### Example usage of `rawConfig` for a StackClusterColumn chart

```jsx
import { StackClusterColumn } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const StackClusterColumnChartExample = () => {
  const rawConfig = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        [
          "product",
          "2015",
          "2016",
          "2017"
        ],
        [
          "Matcha Latte",
          43.3,
          85.8,
          93.7
        ],
        [
          "Milk Tea",
          83.1,
          73.4,
          55.1
        ],
        [
          "Cheese Cocoa",
          86.4,
          65.2,
          82.5
        ],
        [
          "Walnut Brownie",
          72.4,
          53.9,
          39.1
        ]
      ]
    },
    xAxis: {
      type: "category"
    },
    yAxis: {},
    series: [
      {
        type: "bar"
      },
      {
        type: "bar"
      },
      {
        type: "bar"
      }
    ]
  };

  return <StackClusterColumn rawConfig={rawConfig} />;
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
import 'akvo-charts/dist/index.css'

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

#### Example usage of `rawConfig` for a ScatterPlot chart

```jsx
import { ScatterPlot } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const ScatterPlotChartExample = () => {
  const rawConfig = {
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 20,
        data: [
          [
            10,
            8.04
          ],
          [
            8.07,
            6.95
          ],
          [
            13,
            7.58
          ],
          [
            9.05,
            8.81
          ],
        ],
        type: "scatter"
      }
    ]
  };

  return <ScatterPlot rawConfig={rawConfig} />;
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


#### Example usage of StackLine chart

```jsx
import React from 'react';
import { StackLine } from 'akvo-charts';
import 'akvo-charts/dist/index.css'

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

#### Example usage of `rawConfig` for a StackLine chart

```jsx
import { StackLine } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const StackLineChartExample = () => {
  const rawConfig = {
    title: {
      text: "Product Sales"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985"
        }
      }
    },
    legend: {
      data: [
        "Matcha Latte",
        "Milk Tea",
        "Cheese Cocoa",
        "Walnut Brownie"
      ]
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: [
          "2015",
          "2016",
          "2017",
          "2018"
        ]
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        name: "Matcha Latte",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series"
        },
        data: [
          43.3,
          85.8,
          93.7,
          90
        ]
      },
      {
        name: "Milk Tea",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series"
        },
        data: [
          83.1,
          73.4,
          55.1,
          78
        ]
      },
      {
        name: "Cheese Cocoa",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series"
        },
        data: [
          86.4,
          65.2,
          82.5,
          44.3
        ]
      },
      {
        name: "Walnut Brownie",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series"
        },
        data: [
          72.4,
          53.9,
          39.1,
          55.5
        ]
      }
    ]
  };

  return <StackLine rawConfig={rawConfig} />;
};

export default StackLineChartExample;
```

### MapView

The `MapView` component provides an easy way to render a map in your React application using [Leaflet](https://leafletjs.com/). You can customize the map's appearance, add layers, plot points, and handle user interactions such as clicks. The map configuration is passed via the `config`, `data`, `tile`, and `layer` props.


<a id="map-config"></a>
#### config



#### layer

| Prop         | Type                                                   | Description                                                                                                                                                                   |
|--------------|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source`     | string _or_ object [(GeoJSON/TopoJSON)](https://en.wikipedia.org/wiki/GeoJSON) | Sets the source of the layer data. This can be a reference to a GeoJSON/TopoJSON object stored in a global variable (e.g., `window.topoData`) or a GeoJSON/TopoJSON object directly. |
| `url`        | string                                                  | Sets the GeoJSON/TopoJSON source from a URL. The data from this URL will be fetched and used as the layer source.                                                              |
| `style` _(optional)_  | object                                                  | Defines the styling for GeoJSON lines and polygons using [Path options](https://leafletjs.com/reference.html#path-option), including properties like color, weight, and fillColor. |
| `onClick(map, props)` _(optional)_| function _or_ string                                    | A function that is triggered when a layer feature is clicked. It receives the [map: Map instance](https://leafletjs.com/reference.html#map-factory) and [props: GeoJSON event properties](https://leafletjs.com/reference.html#geojsonevent-properties) as arguments, allowing you to interact with the map or the feature.   |
| `onMouseOver(map, props)` _(optional)_| function _or_ string                                    | A function that is triggered when the mouse hovers over a layer feature. It receives the [map: Map instance](https://leafletjs.com/reference.html#map-factory) and [props: GeoJSON event properties](https://leafletjs.com/reference.html#geojsonevent-properties) as arguments, enabling hover-based interactions. |
|`color` _(optional)_ | array | An array of colors used for choropleth mapping. Each feature will be colored according to its data value based on this color scale.|
|`mapKey` _(optional)_ |string | The key in the GeoJSON feature properties that is used to map the data values for the choropleth map.|
|`choropleth` _(optional)_ | string | The data attribute used for determining the color scale in the choropleth map. This value should match the data property in your dataset.|
|`tooltip` _(optional)_ | object | Configuration for displaying a Leaflet tooltip on a choropleth map. |


##### tooltip (object)
Configuration for displaying a Leaflet tooltip on a choropleth map.
| Prop	| Type |	Description |
|-------|------|--------------|
| `show` | `boolean` |	Determines whether tooltips are enabled globally on the map. |
| `showTooltipForAll` |	`boolean` |	Indicates if tooltips should be shown for all data points, regardless of value. |
| `tooltipComponent` |	`React component` |	Custom React component used to render the tooltip content. |


#### data

An array of objects that define either marker points or data for choropleth mapping. For markers, objects should include point (latitude, longitude) and label. For choropleth, objects should include keys that match [mapKey](#layer) and the corresponding data value (e.g., density).

| Prop	| Type |	Description |
|-------|------|--------------|
| `point` | array [LatLng](https://leafletjs.com/reference.html#latlng) |	Contains geographic points that will be displayed as markers.|
| `label` |	string |	Text to be displayed in the pop-up marker|


#### config

| Prop	| Type |	Description |
|-------|------|--------------|
| `center` | array [LatLng](https://leafletjs.com/reference.html#latlng) |Initial geographic center of the map. `[latitude, longitude]`|
| `zoom` |	number | Initial map zoom level	|
| `height` | string | Set the map height. By default is: `100vh`	|
| `width` |	string | Set the map width.	By default is: `100%`|

#### Example usage of MapView

```jsx
import React from "react";
import { MapView } from "akvo-charts";
import 'akvo-charts/dist/index.css'

const MapViewExample = () => {
  const config = {
    center: [
      -6.2,
      106.816666
    ],
    zoom: 8,
    height: "100vh",
    width: "100%"
  };

  const data = [
    {
      point: [
        -6.170166,
        106.831375
      ],
      label: "Istiqlal Mosque"
    },
    {
      point: [
        -6.174596,
        106.830407
      ],
      label: "Gambir Station"
    },
    {
      point: [
        -6.175414,
        106.827175
      ],
      label: "The National Monument"
    }
  ];

  const onClick = (map, { target }) => map.fitBounds(target._bounds);
  const layer = {
    source: "window.topoData",
    url: "https://akvo.github.io/akvo-charts/static/geojson/indonesia-prov.geojson",
    style: {
      color: "#92400e",
      weight: 1,
      fillColor: "#fbbf24"
    },
    onClick: onClick
  };

  const tile = {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  };

  return <MapView tile={tile} layer={layer} data={data} config={config} />;
};

export default MapViewExample;
```

#### Example Usage with Choropleth Mapping

Here is an example of how to define a layer in MapView for applying a choropleth map:

```jsx
const ChoroPlethExample = () => {
  const CustomTooltip = ({ props }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <div style={{ fontWeight: 700 }}>{props?.name || 'No Name'}</div>
      <div>Density: {props?.density || 'N/A'}</div>
    </div>
  );

  const config = {
    center: [-6.2, 106.816666],
    zoom: 8,
    height: "100vh",
    width: "100%",
  };

  const data = [
    {
      Propinsi: "DI. ACEH",
      density: 92,
    },
    {
      Propinsi: "SUMATERA UTARA",
      density: 205,
    },
    // more data here
  ];

  const onClick = (map, { target }) => map.fitBounds(target._bounds);
  const layer = {
    source: "window.topoData",
    url: "https://akvo.github.io/akvo-charts/static/geojson/indonesia-prov.geojson",
    style: {
      color: "#92400e",
      weight: 1,
      fillColor: "#fbbf24",
      fillOpacity: 0.7,
    },
    color: [
      "#FFEDA0",
      "#FED976",
      "#FFEDA0",
      "#FED976",
    ],
    mapKey: "Propinsi",
    choropleth: "density",
    onClick: onClick,
    tooltip: {
        show: true,
        showTooltipForAll: false,
        tooltipComponent: CustomTooltip
      },
  };

  const tile = {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  };

  return (
    <div>
      <MapView tile={tile} layer={layer} data={data} config={config} />
    </div>
  );
};

export default ChoroPlethExample;
```

### MapCluster
The `MapCluster` component provides an initial implementation for map clustering in Akvo project use cases. It leverages [Container](#map-container), [MarkerClusterGroup](#map-marker-cluster-group), and [Marker](#map-marker) to group and display markers on a map.

#### Props

##### `markerIcon`
Defines the styling and attributes for individual marker icons.
| Prop         | Type               | Description                                 |
|--------------|--------------------|---------------------------------------------|
| `className`  | `string`           | CSS class for styling the marker icon.      |
| `iconSize`   | `[number, number]` | Dimensions of the marker icon `[width, height]`. |
| `html`       | `boolean`          | If `true`, uses a default HTML circle icon. |

##### `clusterIcon`
Defines the styling and attributes for cluster icons.
| Prop         | Type           | Description                                 |
|--------------|----------------|---------------------------------------------|
| `className`  | `string`       | CSS class for styling the cluster icon.     |
| `iconSize`   | `number`       | Size of the cluster icon in pixels.         |

##### Additional Properties
| Prop           | Type                               | Description                                                                 |
|----------------|------------------------------------|-----------------------------------------------------------------------------|
| `groupKey`     | `string`                           | Key used to group data when `type` is set to `"circle"`.                    |
| `type`         | `enum`(default&#124;circle) |Defines the clustering mode:                                               |
|                |                                    | - `"default"`: Uses default styles from [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster). |
|                |                                    | - `"circle"`: Uses predefined styles specific to common Akvo project use cases. |
| `renderPopup`  | `function`                         | Function to render a custom child component in the marker popup.            |

---

#### Example Usage

```jsx
import React from "react";
import MapCluster from "./MapCluster";
import 'akvo-charts/dist/index.css'

const markerIcon = {
  className: "custom-marker",
  iconSize: [32, 32],
  html: true,
};

const clusterIcon = {
  className: "custom-marker-cluster",
  iconSize: 60,
};

const tile = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  maxZoom: 19,
  attribution: "© OpenStreetMap",
};

const config = {
  // Additional configuration options for the map can go here.
};

const data = [
  // Provide the array of data points for the map here.
];

const Chart = () => {
  return (
    <div>
      <MapCluster
        tile={tile}
        config={config}
        data={data}
        markerIcon={markerIcon}
        clusterIcon={clusterIcon}
        groupKey={"serviceLevel"}
        type={"circle"}
      />
    </div>
  );
};

export default Chart;
```

#### MapCluster Notes
- When using `"default"` for `type`, the component applies styles from [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).
- When using `"circle"` for `type`, the component applies Akvo-specific predefined styles.
- Ensure the `data` prop is formatted correctly to include the required latitude and longitude coordinates for each marker.
- Customize `renderPopup` to display additional information for markers as needed.


---


### Fully Customized Map
If the [MapView](#mapview) or [MapCluster](#mapcluster) components do not meet your specific requirements, you can use this fully customizable map component to create a tailored solution.


### Components

#### <a id="map-container"></a>Container
The `Container` component serves as the base for rendering a map.

| Prop         | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `children`   | `node`         | Valid map or React components to be rendered inside the container. |
| `tile`       | `object`       | Accepts all valid [Tile Layer options](#map-tile-layer). |
| `config`     | `object`       | Accepts all valid [config options](#map-config). |

---

#### <a id="map-geojson"></a>GeoJson
The `GeoJson` component allows you to render GeoJSON data as layers on the map.

| Prop         | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `onClick`    | `function`     | Event handler for click events on the layer. |
| `onMouseOver`| `function`     | Event handler for mouseover events on the layer. |
| `data`       | `object`       | Accepts valid [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) objects. |
| `style`      | `object`       | Styles the layer, e.g., for choropleth maps, using React inline CSS format. |

---

#### <a id="map-legend-control"></a>LegendControl
The `LegendControl` component creates a legend control based on color ranges.

| Prop         | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `data`       | `array`        | Single-dimension array defining legend data. |
| `color`      | `array`        | Array of colors corresponding to the data ranges. |

---

#### <a id="map-marker"></a>Marker
The `Marker` component is used to display individual points on the map.

| Prop         | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `children`   | `node`         | Valid React components to display in the marker popup. |
| `latlng`     | `[number, number]` | Latitude and longitude of the marker `[latitude, longitude]`. |
| `label`      | `string`       | Label or title for the marker.               |

It also supports all [Marker options](https://leafletjs.com/reference.html#marker-option).

---

#### <a id="map-marker-cluster-group"></a>MarkerClusterGroup
The `MarkerClusterGroup` component groups multiple markers into clusters.

| Prop            | Type           | Description                                   |
|-----------------|----------------|-----------------------------------------------|
| `children`      | `node`         | Valid React components to be clustered.      |
| `iconCreateFn`  | `function`     | Function to customize the cluster icon.      |
| `onClick`       | `function`     | Event handler for click events on the cluster. |
| `onMarkerClick` | `function`     | Event handler for click events on individual markers. |

It supports all [Leaflet.markercluster options](https://github.com/Leaflet/Leaflet.markercluster#all-options).

---

#### <a id="map-tile-layer"></a>TileLayer
The `TileLayer` component is used to display map tiles.

| Prop         | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `url`        | `string`       | The URL template for the tile layer.         |
| `maxZoom`    | `number`       | The maximum zoom level for the layer.        |
| `attribution`| `string`       | Attribution text to display on the map.      |

It supports all [TileLayer options](https://leafletjs.com/reference.html#tilelayer-option).

---

#### <a id="map-utils"></a>Utils

* `getGeoJSONList`: This utility function converts TopoJSON data to GeoJSON using the [topojson-client library](https://www.npmjs.com/package/topojson-client).

---

#### Example Usage

```jsx
import { Map } from 'akvo-charts';
import 'akvo-charts/dist/index.css'
****
const { getGeoJSONList } = Map;

const DisplayMap = () => {
  const mapConfig = {
    config: {
      center: [-6.2, 106.816666],
      zoom: 8,
      height: "100vh",
      width: "100%",
    },
  };

  const iconCreateFn = (cluster) => (
    <div className="custom-cluster-icon">
      {cluster.getChildCount()}
    </div>
  );

  const geoProps = {
    style: {
      fillColor: "#f28c28",
      weight: 2,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    },
    onClick: (e) => console.log("Layer clicked!", e),
  };
  const data = [
    // Provide the array of data points for the map here.
  ];
  const geoData = {
  // Provide the object of geojson data for the map here.
  }

  return (
    <Map.Container {...mapConfig}>
      {getGeoJSONList(geoData).map((gd, gx) => (
        <Map.GeoJson key={gx} data={gd} {...geoProps} />
      ))}
      <Map.MarkerClusterGroup iconCreateFn={iconCreateFn}>
        {data
          ?.filter((d) => d?.point)
          ?.map((d, dx) => (
            <Map.Marker
              key={dx}
              latlng={d.point}
              icon={{
                className: 'custom-marker',
                iconSize: [32, 32],
                html: `<span style="background-color:${d.color}; border:2px solid #fff;" />`,
              }}
            >
              <ul className="w-full text-base space-y-1">
                <li>
                  <strong>School: </strong>
                  <span>{d.label}</span>
                </li>
                <li>
                  <strong>Service Level: </strong>
                  <span>{d.serviceLevel}</span>
                </li>
              </ul>
            </Map.Marker>
          ))}
      </Map.MarkerClusterGroup>
    </Map.Container>
  );
};

export default DisplayMap;
```

#### Map components Notes
- Customize `iconCreateFn` to define your cluster icons dynamically.
- Use `getGeoJSONList` to handle TopoJSON conversions and simplify rendering GeoJSON layers.
- Always define `style` properties for `GeoJson` to ensure proper rendering of layers.

---

[Back to top](#akvo-charts)