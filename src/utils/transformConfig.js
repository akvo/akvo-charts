import {
  Animation,
  Colors,
  TextStyle,
  backgroundColor,
  Title,
  Grid,
  Tooltip,
  Axis
} from './basicChartStyle';

const transformConfig = ({
  title,
  xAxisLabel = null,
  yAxisLabel = null,
  horizontal = false
}) => {
  return {
    title: {
      ...Title,
      text: title
    },
    grid: {
      ...Grid
    },
    tooltip: {
      ...Tooltip
    },
    xAxis: {
      type: horizontal ? 'value' : 'category',
      name: xAxisLabel,
      nameTextStyle: { ...TextStyle },
      ...Axis
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      name: yAxisLabel,
      nameTextStyle: { ...TextStyle },
      ...Axis
    },
    series: [],
    ...Colors,
    ...backgroundColor,
    ...Animation
  };
};

export default transformConfig;
