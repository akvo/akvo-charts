import transformConfig from './transformConfig';

describe('transformConfig', () => {
  it('should transform configuration correctly', () => {
    const config = {
      title: 'Chart Example',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis'
    };

    const expectedOutput = {
      title: {
        text: 'Chart Example'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        name: 'X Axis'
      },
      yAxis: {
        type: 'value',
        name: 'Y Axis'
      },
      series: []
    };

    expect(transformConfig(config)).toEqual(expectedOutput);
  });

  it('should transform configuration without xAxis and yAxis labels', () => {
    const config = {
      title: 'Chart Example'
    };

    const expectedOutput = {
      title: {
        text: 'Chart Example'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        name: null
      },
      yAxis: {
        type: 'value',
        name: null
      },
      series: []
    };

    expect(transformConfig(config)).toEqual(expectedOutput);
  });
});
