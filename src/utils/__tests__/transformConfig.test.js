import transformConfig from '../transformConfig';

describe('transformConfig', () => {
  it('should transform config correctly for vertical chart', () => {
    const config = transformConfig({
      title: 'Vertical Chart',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',
      dimensions: ['name', 'age', 'score']
    });

    expect(config).toEqual({
      title: {
        show: true,
        text: 'Vertical Chart',
        subtext: '',
        textAlign: 'center',
        left: '50%',
        textStyle: { color: '#000', fontSize: 14, fontWeight: 'bold' }
      },
      grid: {
        containLabel: true,
        left: '4%',
        right: '4%',
        bottom: '10%',
        top: '25%'
      },
      legend: {
        show: true,
        icon: 'circle',
        top: 35,
        left: 'center',
        align: 'left',
        orient: 'horizontal',
        itemGap: 10,
        textStyle: { fontWeight: 'normal', fontSize: 12 },
        data: ['age', 'score']
      },
      tooltip: {
        trigger: 'item',
        axisPointer: { type: 'shadow' },
        textStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' }
      },
      xAxis: {
        type: 'category',
        name: 'X Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        nameGap: 45,
        nameLocation: 'center',
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'normal' },
        axisLine: {
          lineStyle: {
            color: '#000'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#000'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Y Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        nameGap: 20,
        nameLocation: 'end',
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'normal' },
        axisLine: {
          lineStyle: {
            color: '#000'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#000'
          }
        }
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
        show: true,
        text: 'Horizontal Chart',
        subtext: '',
        textAlign: 'center',
        left: '50%',
        textStyle: { color: '#000', fontSize: 14, fontWeight: 'bold' }
      },
      grid: {
        containLabel: true,
        left: '4%',
        right: '4%',
        bottom: '10%',
        top: '25%'
      },
      legend: {
        show: true,
        icon: 'circle',
        top: 35,
        left: 'center',
        align: 'left',
        orient: 'horizontal',
        itemGap: 10,
        textStyle: { fontWeight: 'normal', fontSize: 12 },
        data: []
      },
      tooltip: {
        trigger: 'item',
        axisPointer: { type: 'shadow' },
        textStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' }
      },
      xAxis: {
        type: 'value',
        name: 'X Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        nameGap: 20,
        nameLocation: 'end',
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'normal' },
        axisLine: {
          lineStyle: {
            color: '#000'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#000'
          }
        }
      },
      yAxis: {
        type: 'category',
        name: 'Y Axis',
        nameTextStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' },
        nameGap: 45,
        nameLocation: 'center',
        axisLabel: { color: '#000', fontSize: 12, fontWeight: 'normal' },
        axisLine: {
          lineStyle: {
            color: '#000'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#000'
          }
        }
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
