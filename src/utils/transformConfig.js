import {
  Animation,
  Colors,
  TextStyle,
  backgroundColor,
  Title,
  Grid,
  Tooltip,
  Axis,
  Legend
} from './basicChartStyle';

const transformConfig = ({
  title,
  xAxisLabel = null,
  yAxisLabel = null,
  horizontal = false,
  dimensions = [],
  showAxis = true
}) => {
  let legend = {
    ...Legend,
    data: dimensions.slice(1)
  };

  let axis = {
    xAxis: {
      type: horizontal ? 'value' : 'category',
      name: xAxisLabel,
      nameTextStyle: { ...TextStyle },
      nameLocation: 'center',
      nameGap: 45,
      ...Axis
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      name: yAxisLabel,
      nameTextStyle: { ...TextStyle },
      nameLocation: 'end',
      nameGap: 20,
      ...Axis
    }
  };

  if (!showAxis) {
    legend = { ...Legend };
    axis = {};
  }

  return {
    title: {
      ...Title,
      text: title
    },
    grid: {
      ...Grid
    },
    legend,
    tooltip: {
      ...Tooltip
    },
    ...axis,
    series: [],
    ...Colors,
    ...backgroundColor,
    ...Animation
  };
};

export default transformConfig;
