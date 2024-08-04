import transformConfig from '../transformConfig';

describe('transformConfig', () => {
  it('should transform config correctly for vertical chart with all properties', () => {
    const config = transformConfig({
      title: 'Vertical Chart',
      subtitle: 'Subtitle',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',
      dimensions: ['name', 'age', 'score'],
      showAxis: true,
      textStyle: {
        color: '#ff0000',
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        fontSize: 16
      },
      color: ['red', 'orange', 'yellow'],
      legend: {
        show: true,
        icon: 'triangle',
        top: 40,
        left: 'left',
        align: 'left',
        orient: 'vertical',
        itemGap: 15
      }
    });

    expect(config).toEqual({
      title: {
        show: true,
        text: 'Vertical Chart',
        subtext: 'Subtitle',
        textAlign: 'center',
        left: '50%',
        textStyle: {
          color: '#ff0000',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          fontSize: 16
        }
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
        icon: 'triangle',
        top: 40,
        left: 'left',
        align: 'left',
        orient: 'vertical',
        itemGap: 15,
        textStyle: {
          color: '#ff0000',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          fontSize: 16
        },
        data: ['age', 'score']
      },
      tooltip: {
        trigger: 'item',
        axisPointer: { type: 'shadow' },
        textStyle: {
          color: '#ff0000',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          fontSize: 16
        }
      },
      xAxis: {
        type: 'category',
        name: 'X Axis',
        nameTextStyle: {
          color: '#ff0000',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          fontSize: 16
        },
        nameGap: 45,
        nameLocation: 'center',
        axisLabel: {
          color: '#ff0000',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          fontSize: 16
        },
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
        nameTextStyle: {
          color: '#ff0000',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          fontSize: 16
        },
        nameGap: 20,
        nameLocation: 'end',
        axisLabel: {
          color: '#ff0000',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          fontSize: 16
        },
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
      color: ['red', 'orange', 'yellow'],
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

  it('should transform config correctly for horizontal chart with default textStyle', () => {
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
        type: 'category',
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

  it('should set show axis options to false when showAxis param is false', () => {
    const config = transformConfig({
      title: 'Horizontal Chart',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',
      horizontal: true,
      showAxis: false
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
        textStyle: { fontWeight: 'normal', fontSize: 12 }
      },
      tooltip: {
        trigger: 'item',
        axisPointer: { type: 'shadow' },
        textStyle: { color: '#000', fontSize: 12, fontWeight: 'bold' }
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
