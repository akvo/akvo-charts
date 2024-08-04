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

export const filterObjNullValue = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});

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
  legend = {
    show: true,
    icon: null,
    top: null,
    left: null,
    align: null,
    orient: null,
    itemGap: null
  },
  color = [],
  // this is only for inside akvo charts purpose
  dimensions = [],
  showAxis = true
  // eol
}) => {
  const defaultLegend = showAxis
    ? {
        ...Legend,
        data: dimensions.slice(1)
      }
    : { ...Legend };

  const overrideTextStyle = Object.keys(filterObjNullValue(textStyle)).length
    ? filterObjNullValue(textStyle)
    : {};

  const overrideColor = color.length ? { color } : { ...Colors };

  const overrideLegend = Object.keys(filterObjNullValue(legend)).length
    ? {
        ...defaultLegend,
        top: subtitle ? 50 : defaultLegend.top,
        ...filterObjNullValue(legend)
      }
    : { ...defaultLegend, top: subtitle ? 50 : defaultLegend.top };

  const axis = showAxis
    ? {
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
      }
    : {};

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
      ...overrideLegend,
      textStyle: {
        ...overrideLegend.textStyle,
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
    series: [],
    ...overrideColor,
    ...backgroundColor,
    ...Animation
  };
};

export default transformConfig;
