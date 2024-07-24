import transformConfig from './transformConfig';

describe('transformConfig', () => {
  it('should transform configuration with default axis types (vertical)', () => {
    const config = {
      title: 'Vertical Chart Example',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis'
    };

    const expectedOutput = {
      title: {
        text: 'Vertical Chart Example'
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

  it('should transform configuration with horizontal axis types', () => {
    const config = {
      title: 'Horizontal Chart Example',
      xAxisLabel: 'Y Axis',
      yAxisLabel: 'X Axis',
      horizontal: true
    };

    const expectedOutput = {
      title: {
        text: 'Horizontal Chart Example'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'value',
        name: 'Y Axis'
      },
      yAxis: {
        type: 'category',
        name: 'X Axis'
      },
      series: []
    };

    expect(transformConfig(config)).toEqual(expectedOutput);
  });

  it('should transform configuration without axis labels (horizontal)', () => {
    const config = {
      title: 'Horizontal Pie Chart Example',
      horizontal: true
    };

    const expectedOutput = {
      title: {
        text: 'Horizontal Pie Chart Example'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'value',
        name: null
      },
      yAxis: {
        type: 'category',
        name: null
      },
      series: []
    };

    expect(transformConfig(config)).toEqual(expectedOutput);
  });

  it('should transform configuration without axis labels (vertical)', () => {
    const config = {
      title: 'Vertical Pie Chart Example'
    };

    const expectedOutput = {
      title: {
        text: 'Vertical Pie Chart Example'
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
