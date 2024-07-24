const transformConfig = ({
  title,
  xAxisLabel = null,
  yAxisLabel = null,
  horizontal = false
}) => {
  return {
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: horizontal ? 'value' : 'category',
      name: xAxisLabel
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      name: yAxisLabel
    },
    series: []
  };
};

export default transformConfig;
