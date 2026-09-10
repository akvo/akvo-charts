export const backgroundColor = {
  backgroundColor: 'transparent'
};

export const Animation = {
  animation: true,
  animationThreshold: 2000,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  animationDelay: 0,
  animationDurationUpdate: 300,
  animationEasingUpdate: 'cubicOut',
  animationDelayUpdate: 0
};

export const TextStyle = {
  color: '#000',
  fontSize: 12,
  fontWeight: 'bold'
};

export const Colors = {
  color: [
    '#4475B4',
    '#73ADD1',
    '#AAD9E8',
    '#FEE08F',
    '#FDAE60',
    '#F36C42',
    '#D73027'
  ]
};

export const Legend = {
  show: true,
  icon: 'circle',
  top: 35,
  left: 'center',
  align: 'left',
  orient: 'horizontal',
  itemGap: 10,
  textStyle: {
    fontWeight: 'normal',
    fontSize: 12
  }
};

export const Title = {
  show: true,
  textAlign: 'center',
  left: '50%',
  textStyle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold'
  }
};

export const Grid = {
  containLabel: true,
  left: '4%',
  right: '4%',
  bottom: '10%',
  top: '25%'
};

export const Tooltip = {
  trigger: 'item',
  axisPointer: {
    type: 'shadow'
  },
  textStyle: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold'
  }
};

export const Axis = {
  axisLabel: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'normal'
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
};

// Non-positional defaults only. Position comes from ToolboxPosition, so that
// merging a 'left' position can never leave a stale 'right' behind - ECharts
// would honour both.
export const Toolbox = {
  show: true,
  itemSize: 15,
  itemGap: 10
};

// The vertically centered positions also stand the toolbar up: a horizontal
// strip floating in the middle of the plot reads as debris.
export const ToolboxPosition = {
  righttop: { right: 10, top: 0 },
  lefttop: { left: 10, top: 0 },
  rightbottom: { right: 10, bottom: 10 },
  leftbottom: { left: 10, bottom: 10 },
  right: { right: 10, top: 'middle', orient: 'vertical' },
  left: { left: 10, top: 'middle', orient: 'vertical' },
  center: { left: 'center', top: 0 }
};

// Download glyph for the custom CSV tool. ECharts custom features need an
// icon of their own; built-in features supply theirs.
export const CsvIcon = 'path://M11 2h2v8h3l-4 5-4-5h3V2zM4 17h16v2H4v-2z';
