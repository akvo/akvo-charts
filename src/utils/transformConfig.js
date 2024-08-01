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
  subtitle = null,
  xAxisLabel = null,
  yAxisLabel = null,
  horizontal = false,
  textStyle = {
    color: null,
    fontStyle: null,
    fontWeight: null,
    fontFamily: null,
    fontSize: null
  },
  // this is only for inside akvo charts purpose
  dimensions = [],
  showAxis = true
  // eol
}) => {
  const filteredTextStyle = Object.entries(textStyle).reduce(
    (acc, [key, value]) => {
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
  const overrideTextStyle = Object.keys(filteredTextStyle).length
    ? filteredTextStyle
    : {};

  let legend = {
    ...Legend,
    data: dimensions.slice(1)
  };

  let axis = {
    xAxis: {
      type: horizontal ? 'value' : 'category',
      name: xAxisLabel,
      nameTextStyle: { ...TextStyle, ...overrideTextStyle },
      nameLocation: 'center',
      nameGap: 45,
      ...Axis,
      axisLabel: {
        ...Axis.axisLabel,
        ...overrideTextStyle
      }
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      name: yAxisLabel,
      nameTextStyle: { ...TextStyle, ...overrideTextStyle },
      nameLocation: 'end',
      nameGap: 20,
      ...Axis,
      axisLabel: {
        ...Axis.axisLabel,
        ...overrideTextStyle
      }
    }
  };

  if (!showAxis) {
    legend = { ...Legend };
    axis = {};
  }

  return {
    title: {
      ...Title,
      text: title,
      subtext: subtitle ? subtitle : '',
      textStyle: {
        ...Title.textStyle,
        ...overrideTextStyle
      }
    },
    grid: {
      ...Grid
    },
    legend: {
      ...legend,
      top: subtitle ? 50 : Legend.top,
      textStyle: {
        ...legend.textStyle,
        ...overrideTextStyle
      }
    },
    tooltip: {
      ...Tooltip,
      textStyle: {
        ...Tooltip.textStyle,
        ...overrideTextStyle
      }
    },
    ...axis,
    series: [
      { label: { ...TextStyle, fontWeight: 'normal', ...overrideTextStyle } }
    ],
    ...Colors,
    ...backgroundColor,
    ...Animation
  };
};

export default transformConfig;
