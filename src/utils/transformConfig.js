const transformConfig = ({ title, xAxisLabel = null, yAxisLabel = null }) => {
  return {
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      name: xAxisLabel
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel
    },
    series: []
  };
};

export default transformConfig;
