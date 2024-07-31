import React, { useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { init, getInstanceByDom } from 'echarts';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

var backgroundColor = {
  backgroundColor: 'transparent'
};
var Animation = {
  animation: true,
  animationThreshold: 2000,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  animationDelay: 0,
  animationDurationUpdate: 300,
  animationEasingUpdate: 'cubicOut',
  animationDelayUpdate: 0
};
var TextStyle = {
  color: '#000',
  fontSize: 12,
  fontWeight: 'bold'
};
var Colors = {
  color: ['#4475B4', '#73ADD1', '#AAD9E8', '#FEE08F', '#FDAE60', '#F36C42', '#D73027']
};
var Title = {
  show: false,
  text: '',
  subtext: '',
  textAlign: 'center',
  left: '50%',
  textStyle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'normal'
  }
};
var Grid = {
  containLabel: true,
  left: '3%',
  right: '4%',
  bottom: '3%',
  top: '10%'
};
var Tooltip = {
  trigger: 'axis',
  textStyle: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold'
  }
};
var Axis = {
  axisLabel: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold'
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

var transformConfig = function transformConfig(_ref) {
  var title = _ref.title,
    _ref$xAxisLabel = _ref.xAxisLabel,
    xAxisLabel = _ref$xAxisLabel === void 0 ? null : _ref$xAxisLabel,
    _ref$yAxisLabel = _ref.yAxisLabel,
    yAxisLabel = _ref$yAxisLabel === void 0 ? null : _ref$yAxisLabel,
    _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal;
  return _extends({
    title: _extends({}, Title, {
      text: title
    }),
    grid: _extends({}, Grid),
    tooltip: _extends({}, Tooltip),
    xAxis: _extends({
      type: horizontal ? 'value' : 'category',
      name: xAxisLabel,
      nameTextStyle: _extends({}, TextStyle)
    }, Axis),
    yAxis: _extends({
      type: horizontal ? 'category' : 'value',
      name: yAxisLabel,
      nameTextStyle: _extends({}, TextStyle)
    }, Axis),
    series: []
  }, Colors, backgroundColor, Animation);
};

var useECharts = function useECharts(_ref) {
  var _ref$config = _ref.config,
    config = _ref$config === void 0 ? {} : _ref$config,
    _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data,
    _ref$getOptions = _ref.getOptions,
    getOptions = _ref$getOptions === void 0 ? function () {} : _ref$getOptions;
  var chartRef = useRef(null);
  useEffect(function () {
    var chart;
    if (chartRef.current) {
      setTimeout(function () {
        chart = init(chartRef.current);
        var options = _extends({}, transformConfig(_extends({}, config)), getOptions({
          data: data
        }));
        chart.setOption(options);
      }, 0);
    }
    return function () {
      if (chart) {
        chart.dispose();
      }
    };
  }, [config, data, getOptions]);
  return chartRef;
};

var styles = {"container":"ae-container"};

var _getOptions = function getOptions(_ref) {
  var _ref2;
  var _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data,
    _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal;
  var axis = horizontal ? 'yAxis' : 'xAxis';
  return _ref2 = {}, _ref2[axis] = {
    data: data.map(function (item) {
      return item.label;
    })
  }, _ref2.series = [{
    data: data.map(function (item) {
      return item.value;
    }),
    type: 'bar'
  }], _ref2;
};
var Bar = function Bar(_ref3) {
  var config = _ref3.config,
    data = _ref3.data,
    _ref3$horizontal = _ref3.horizontal,
    horizontal = _ref3$horizontal === void 0 ? false : _ref3$horizontal;
  var chartRef = useECharts({
    config: _extends({}, config, {
      horizontal: horizontal
    }),
    data: data,
    getOptions: function getOptions(_ref4) {
      var data = _ref4.data;
      return _getOptions({
        data: data,
        horizontal: horizontal
      });
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

var _getOptions$1 = function getOptions(_ref) {
  var _ref2;
  var _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data,
    _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal;
  var axis = horizontal ? 'yAxis' : 'xAxis';
  return _ref2 = {}, _ref2[axis] = {
    data: data.map(function (item) {
      return item.label;
    })
  }, _ref2.series = [{
    data: data.map(function (item) {
      return item.value;
    }),
    type: 'line'
  }], _ref2;
};
var Line = function Line(_ref3) {
  var config = _ref3.config,
    data = _ref3.data,
    _ref3$horizontal = _ref3.horizontal,
    horizontal = _ref3$horizontal === void 0 ? false : _ref3$horizontal;
  var chartRef = useECharts({
    config: _extends({}, config, {
      horizontal: horizontal
    }),
    data: data,
    getOptions: function getOptions(_ref4) {
      var data = _ref4.data;
      return _getOptions$1({
        data: data,
        horizontal: horizontal
      });
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

var _getOptions$2 = function getOptions(_ref) {
  var _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data;
  return {
    series: [{
      type: 'pie',
      data: data.map(function (item) {
        return {
          name: item.label,
          value: item.value
        };
      })
    }]
  };
};
var Pie = function Pie(_ref2) {
  var config = _ref2.config,
    data = _ref2.data;
  var chartRef = useECharts({
    config: config,
    data: data,
    getOptions: function getOptions(_ref3) {
      var data = _ref3.data;
      return _getOptions$2({
        data: data
      });
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

var MAX = 70;
var _getOptions$3 = function getOptions(_ref) {
  var _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data,
    radius = _ref.radius;
  return {
    series: [{
      radius: radius,
      data: data.map(function (item) {
        return {
          name: item.label,
          value: item.value
        };
      })
    }]
  };
};
var Doughnut = function Doughnut(_ref2) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$size = _ref2.size,
    size = _ref2$size === void 0 ? 40 : _ref2$size;
  var torus = useMemo(function () {
    if (size >= 70) {
      return 0;
    }
    return MAX - size;
  }, [size]);
  var chartRef = useECharts({
    config: config,
    data: data,
    getOptions: function getOptions(_ref3) {
      var data = _ref3.data;
      return _getOptions$3({
        data: data,
        radius: [torus + "%", MAX + "%"]
      });
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

var getOptions = function getOptions(_ref) {
  var _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data,
    _ref$symbolSize = _ref.symbolSize,
    symbolSize = _ref$symbolSize === void 0 ? 20 : _ref$symbolSize;
  return {
    series: [{
      symbolSize: symbolSize,
      data: data.filter(function (d) {
        return Array.isArray(d);
      }),
      type: 'scatter'
    }]
  };
};
var ScatterPlot = forwardRef(function (_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$symbolSize = _ref2.symbolSize,
    symbolSize = _ref2$symbolSize === void 0 ? 20 : _ref2$symbolSize,
    _ref2$isTest = _ref2.isTest,
    isTest = _ref2$isTest === void 0 ? false : _ref2$isTest;
  var chartRef = useRef(null);
  useImperativeHandle(ref, function () {
    return {
      getChartInstance: function getChartInstance() {
        return chartRef.current ? getInstanceByDom(chartRef.current) : null;
      }
    };
  });
  useEffect(function () {
    var chart;
    if (chartRef.current) {
      chart = isTest ? init(chartRef.current, 'light', {
        renderer: 'svg',
        width: 400,
        height: 400
      }) : init(chartRef.current, 'light', {
        renderer: 'svg'
      });
      var options = _extends({}, transformConfig(_extends({}, config, {
        symbolSize: symbolSize
      })), getOptions({
        data: data
      }));
      chart.setOption(options);
    }
    return function () {
      if (chart) {
        chart.dispose();
      }
    };
  }, [config, data, isTest, symbolSize]);
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container,
    "data-testid": "scatter-plot"
  });
});

export { Bar, Doughnut, Line, Pie, ScatterPlot };
//# sourceMappingURL=index.modern.js.map
