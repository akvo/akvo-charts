import transformConfig from './transformConfig';

describe('transformConfig', () => {
  it('should transform config correctly for vertical chart', () => {
    const config = transformConfig({
      title: 'Vertical Chart',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis'
    });

    expect(config).toEqual({
      title: {
        show: false,
        text: 'Vertical Chart',
        subtext: '',
        textAlign: 'center',
        left: '50%',
        textStyle: {
          color: '#000',
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      grid: {
        containLabel: true,
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%'
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          color: '#000',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      xAxis: {
        type: 'category',
        name: 'X Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLine: { lineStyle: { color: '#000' } },
        axisTick: { lineStyle: { color: '#000' } }
      },
      yAxis: {
        type: 'value',
        name: 'Y Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLine: { lineStyle: { color: '#000' } },
        axisTick: { lineStyle: { color: '#000' } }
      },
      series: [],
      color: [
        '#4475B4',
        '#73ADD1',
        '#AAD9E8',
        '#FEE08F',
        '#FDAE60',
        '#F36C42',
        '#D73027'
      ],
      backgroundColor: 'transparent',
      animation: true,
      animationThreshold: 2000,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: 0,
      animationDurationUpdate: 300,
      animationEasingUpdate: 'cubicOut',
      animationDelayUpdate: 0
    });
  });

  it('should transform config correctly for horizontal chart', () => {
    const config = transformConfig({
      title: 'Horizontal Chart',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',
      horizontal: true
    });

    expect(config).toEqual({
      title: {
        show: false,
        text: 'Horizontal Chart',
        subtext: '',
        textAlign: 'center',
        left: '50%',
        textStyle: {
          color: '#000',
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      grid: {
        containLabel: true,
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%'
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          color: '#000',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      xAxis: {
        type: 'value',
        name: 'X Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLine: { lineStyle: { color: '#000' } },
        axisTick: { lineStyle: { color: '#000' } }
      },
      yAxis: {
        type: 'category',
        name: 'Y Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        axisLine: { lineStyle: { color: '#000' } },
        axisTick: { lineStyle: { color: '#000' } }
      },
      series: [],
      color: [
        '#4475B4',
        '#73ADD1',
        '#AAD9E8',
        '#FEE08F',
        '#FDAE60',
        '#F36C42',
        '#D73027'
      ],
      backgroundColor: 'transparent',
      animation: true,
      animationThreshold: 2000,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: 0,
      animationDurationUpdate: 300,
      animationEasingUpdate: 'cubicOut',
      animationDelayUpdate: 0
    });
  });
});
