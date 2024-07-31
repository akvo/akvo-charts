import React, { useRef, useEffect, useMemo } from 'react';
import { init } from 'echarts';

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
var Legend = {
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
var Title = {
  show: true,
  text: '',
  subtext: '',
  textAlign: 'center',
  left: '50%',
  textStyle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold'
  }
};
var Grid = {
  containLabel: true,
  left: '4%',
  right: '4%',
  bottom: '10%',
  top: '25%'
};
var Tooltip = {
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
var Axis = {
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

var transformConfig = function transformConfig(_ref) {
  var title = _ref.title,
    _ref$xAxisLabel = _ref.xAxisLabel,
    xAxisLabel = _ref$xAxisLabel === void 0 ? null : _ref$xAxisLabel,
    _ref$yAxisLabel = _ref.yAxisLabel,
    yAxisLabel = _ref$yAxisLabel === void 0 ? null : _ref$yAxisLabel,
    _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal,
    _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions;
  return _extends({
    title: _extends({}, Title, {
      text: title
    }),
    grid: _extends({}, Grid),
    legend: _extends({}, Legend, {
      data: dimensions.slice(1)
    }),
    tooltip: _extends({}, Tooltip),
    xAxis: _extends({
      type: horizontal ? 'value' : 'category',
      name: xAxisLabel,
      nameTextStyle: _extends({}, TextStyle),
      nameLocation: horizontal ? 'end' : 'center',
      nameGap: horizontal ? 20 : 45
    }, Axis),
    yAxis: _extends({
      type: horizontal ? 'category' : 'value',
      name: yAxisLabel,
      nameTextStyle: _extends({}, TextStyle),
      nameLocation: horizontal ? 'center' : 'end',
      nameGap: horizontal ? 45 : 20
    }, Axis),
    series: []
  }, Colors, backgroundColor, Animation);
};

var sortKeys = function sortKeys(keys) {
  if (keys === void 0) {
    keys = [];
  }
  var dynamicKey = keys.find(function (key) {
    return isNaN(key);
  });
  var otherKeys = keys.filter(function (key) {
    return key !== dynamicKey;
  });
  return [dynamicKey].concat(otherKeys);
};
var normalizeData = function normalizeData(data) {
  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0])) {
      var categories = data[0],
        rows = data.slice(1);
      var dimensions = categories.map(function (item) {
        return item.toLowerCase();
      });
      var source = rows.map(function (row) {
        var obj = {};
        categories.forEach(function (cat, index) {
          obj[cat.toLowerCase()] = row[index] !== undefined ? row[index] : 0;
        });
        return obj;
      });
      return {
        dimensions: dimensions,
        source: source
      };
    } else if (data.length > 0 && typeof data[0] === 'object') {
      var keys = Array.from(new Set(data.flatMap(function (d) {
        return d ? Object.keys(d) : [];
      })));
      var sortedKeys = sortKeys(keys);
      var _dimensions = sortedKeys;
      var _source = data.filter(function (i) {
        return i;
      }).map(function (item) {
        var obj = {};
        sortedKeys.forEach(function (key) {
          obj[key] = item[key] !== undefined ? item[key] : 0;
        });
        return obj;
      });
      return {
        dimensions: _dimensions,
        source: _source
      };
    }
  } else if (typeof data === 'object') {
    var _keys = Object.keys(data);
    var maxLength = Math.max.apply(Math, _keys.map(function (key) {
      return data[key].length;
    }));
    var _sortedKeys = sortKeys(_keys);
    var _source2 = Array.from({
      length: maxLength
    }, function (_, i) {
      return _sortedKeys.reduce(function (acc, key) {
        acc[key] = data[key][i] !== undefined ? data[key][i] : 0;
        return acc;
      }, {});
    });
    return {
      dimensions: _sortedKeys,
      source: _source2
    };
  }
  throw new Error('Unsupported data format');
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
        if (!chart && chartRef.current) {
          chart = init(chartRef.current);
        }
        var _normalizeData = normalizeData(data),
          dimensions = _normalizeData.dimensions,
          source = _normalizeData.source;
        var options = _extends({}, transformConfig(_extends({}, config, {
          dimensions: dimensions
        })), {
          dataset: {
            dimensions: dimensions,
            source: source
          }
        }, getOptions({
          dimensions: dimensions
        }));
        if (chart) {
          chart.setOption(options);
        }
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
  var _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal,
    _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions;
  var series = dimensions.slice(1).map(function (dim) {
    return {
      name: dim,
      type: 'bar',
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    };
  });
  return {
    series: series
  };
};
var Bar = function Bar(_ref2) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$horizontal = _ref2.horizontal,
    horizontal = _ref2$horizontal === void 0 ? false : _ref2$horizontal;
  var chartRef = useECharts({
    config: _extends({}, config, {
      horizontal: horizontal
    }),
    data: data,
    getOptions: function getOptions(_ref3) {
      var dimensions = _ref3.dimensions;
      return _getOptions({
        horizontal: horizontal,
        dimensions: dimensions
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
  var _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal,
    _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions;
  var series = dimensions.slice(1).map(function (dim) {
    return {
      name: dim,
      type: 'line',
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    };
  });
  return {
    series: series
  };
};
var Line = function Line(_ref2) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$horizontal = _ref2.horizontal,
    horizontal = _ref2$horizontal === void 0 ? false : _ref2$horizontal;
  var chartRef = useECharts({
    config: _extends({}, config, {
      horizontal: horizontal
    }),
    data: data,
    getOptions: function getOptions(_ref3) {
      var dimensions = _ref3.dimensions;
      return _getOptions$1({
        horizontal: horizontal,
        dimensions: dimensions
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
  var _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions;
  var itemName = dimensions[0];
  var value = dimensions.slice(1);
  return {
    series: [{
      type: 'pie',
      encode: {
        itemName: itemName,
        value: value
      }
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
      var dimensions = _ref3.dimensions;
      return _getOptions$2({
        dimensions: dimensions
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
  var _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions,
    radius = _ref.radius;
  var itemName = dimensions[0];
  var value = dimensions.slice(1);
  return {
    series: [{
      type: 'pie',
      radius: radius,
      encode: {
        itemName: itemName,
        value: value
      }
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
      var dimensions = _ref3.dimensions;
      return _getOptions$3({
        dimensions: dimensions,
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

var _getOptions$4 = function getOptions(symbolSize) {
  return {
    series: [{
      type: 'scatter',
      symbolSize: symbolSize
    }]
  };
};
var ScatterPlot = function ScatterPlot(_ref) {
  var config = _ref.config,
    data = _ref.data,
    _ref$symbolSize = _ref.symbolSize,
    symbolSize = _ref$symbolSize === void 0 ? 10 : _ref$symbolSize;
  var chartRef = useECharts({
    config: config,
    data: data,
    getOptions: function getOptions() {
      return _getOptions$4(symbolSize);
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

var _getOptions$5 = function getOptions(_ref) {
  var dimensions = _ref.dimensions,
    stackMapping = _ref.stackMapping,
    _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? true : _ref$horizontal;
  var dimensionToStackMap = {};
  Object.keys(stackMapping).forEach(function (stackGroup) {
    stackMapping[stackGroup].forEach(function (dim) {
      dimensionToStackMap[dim] = stackGroup;
    });
  });
  var series = dimensions.slice(1).map(function (dim) {
    return {
      name: dim,
      type: 'bar',
      stack: dimensionToStackMap[dim] || 'defaultStack',
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    };
  });
  return {
    tooltip: _extends({}, Tooltip, {
      trigger: 'axis'
    }),
    series: series
  };
};
var StackBar = function StackBar(_ref2) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$stackMapping = _ref2.stackMapping,
    stackMapping = _ref2$stackMapping === void 0 ? {} : _ref2$stackMapping,
    _ref2$horizontal = _ref2.horizontal,
    horizontal = _ref2$horizontal === void 0 ? true : _ref2$horizontal;
  var chartRef = useECharts({
    config: _extends({}, config, {
      horizontal: horizontal
    }),
    data: data,
    getOptions: function getOptions(_ref3) {
      var dimensions = _ref3.dimensions;
      return _getOptions$5({
        dimensions: dimensions,
        stackMapping: stackMapping,
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

var _getOptions$6 = function getOptions(_ref) {
  var _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal,
    _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions;
  var series = dimensions.slice(1).map(function (dim) {
    return {
      name: dim,
      type: 'bar',
      barGap: 0,
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    };
  });
  return {
    tooltip: _extends({}, Tooltip, {
      trigger: 'axis'
    }),
    series: series
  };
};
var StackClusterColumn = function StackClusterColumn(_ref2) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$horizontal = _ref2.horizontal,
    horizontal = _ref2$horizontal === void 0 ? false : _ref2$horizontal;
  var chartRef = useECharts({
    config: _extends({}, config, {
      horizontal: horizontal
    }),
    data: data,
    getOptions: function getOptions(_ref3) {
      var dimensions = _ref3.dimensions;
      return _getOptions$6({
        horizontal: horizontal,
        dimensions: dimensions
      });
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

export { Bar, Doughnut, Line, Pie, ScatterPlot, StackBar, StackClusterColumn };
//# sourceMappingURL=index.modern.js.map
