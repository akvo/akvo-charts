import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useMemo, createContext, Fragment, useContext, useCallback } from 'react';
import { init } from 'echarts';
import { feature } from 'topojson-client';
import 'leaflet/dist/leaflet.css';
import L$1 from 'leaflet';
import mIcon from 'leaflet/dist/images/marker-icon.png';
import mShadow from 'leaflet/dist/images/marker-shadow.png';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
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

var filterObjNullValue = function filterObjNullValue(obj) {
  return Object.entries(obj).reduce(function (acc, _ref) {
    var key = _ref[0],
      value = _ref[1];
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
};
var transformConfig = function transformConfig(_ref2) {
  var title = _ref2.title,
    _ref2$subtitle = _ref2.subtitle,
    subtitle = _ref2$subtitle === void 0 ? null : _ref2$subtitle,
    _ref2$xAxisLabel = _ref2.xAxisLabel,
    xAxisLabel = _ref2$xAxisLabel === void 0 ? null : _ref2$xAxisLabel,
    _ref2$yAxisLabel = _ref2.yAxisLabel,
    yAxisLabel = _ref2$yAxisLabel === void 0 ? null : _ref2$yAxisLabel,
    _ref2$horizontal = _ref2.horizontal,
    horizontal = _ref2$horizontal === void 0 ? false : _ref2$horizontal,
    _ref2$textStyle = _ref2.textStyle,
    textStyle = _ref2$textStyle === void 0 ? {
      color: null,
      fontStyle: null,
      fontWeight: null,
      fontFamily: null,
      fontSize: null
    } : _ref2$textStyle,
    _ref2$legend = _ref2.legend,
    legend = _ref2$legend === void 0 ? {
      show: true,
      icon: null,
      top: null,
      left: null,
      align: null,
      orient: null,
      itemGap: null
    } : _ref2$legend,
    _ref2$color = _ref2.color,
    color = _ref2$color === void 0 ? [] : _ref2$color,
    _ref2$dimensions = _ref2.dimensions,
    dimensions = _ref2$dimensions === void 0 ? [] : _ref2$dimensions,
    _ref2$showAxis = _ref2.showAxis,
    showAxis = _ref2$showAxis === void 0 ? true : _ref2$showAxis;
  var defaultLegend = showAxis ? _extends({}, Legend, {
    data: dimensions.slice(1)
  }) : _extends({}, Legend);
  var overrideTextStyle = Object.keys(filterObjNullValue(textStyle)).length ? filterObjNullValue(textStyle) : {};
  var overrideColor = color.length ? {
    color: color
  } : _extends({}, Colors);
  var overrideLegend = Object.keys(filterObjNullValue(legend)).length ? _extends({}, defaultLegend, {
    top: subtitle ? 50 : defaultLegend.top
  }, filterObjNullValue(legend)) : _extends({}, defaultLegend, {
    top: subtitle ? 50 : defaultLegend.top
  });
  var axis = showAxis ? {
    xAxis: _extends({
      type: horizontal ? 'value' : 'category',
      name: xAxisLabel,
      nameTextStyle: _extends({}, TextStyle, overrideTextStyle),
      nameLocation: 'center',
      nameGap: 45
    }, Axis, {
      axisLabel: _extends({}, Axis.axisLabel, overrideTextStyle)
    }),
    yAxis: _extends({
      type: horizontal ? 'category' : 'value',
      name: yAxisLabel,
      nameTextStyle: _extends({}, TextStyle, overrideTextStyle),
      nameLocation: 'end',
      nameGap: 20
    }, Axis, {
      axisLabel: _extends({}, Axis.axisLabel, overrideTextStyle)
    })
  } : {};
  return _extends({
    title: _extends({}, Title, {
      text: title,
      subtext: subtitle ? subtitle : '',
      textStyle: _extends({}, Title.textStyle, overrideTextStyle)
    }),
    grid: _extends({}, Grid),
    legend: _extends({}, overrideLegend, {
      textStyle: _extends({}, overrideLegend.textStyle, overrideTextStyle)
    }),
    tooltip: _extends({}, Tooltip, {
      textStyle: _extends({}, Tooltip.textStyle, overrideTextStyle)
    })
  }, axis, {
    series: []
  }, overrideColor, backgroundColor, Animation);
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
  if ((data === null || data === void 0 ? void 0 : data.length) === 0) {
    return {
      dimensions: [],
      source: []
    };
  }
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
    getOptions = _ref$getOptions === void 0 ? function () {} : _ref$getOptions,
    _ref$rawConfig = _ref.rawConfig,
    rawConfig = _ref$rawConfig === void 0 ? {} : _ref$rawConfig,
    _ref$rawOverrides = _ref.rawOverrides,
    rawOverrides = _ref$rawOverrides === void 0 ? {} : _ref$rawOverrides;
  var chartRef = useRef(null);
  var _useState = useState(null),
    chartInstance = _useState[0],
    setChartInstance = _useState[1];
  useEffect(function () {
    if (!chartInstance && chartRef.current) {
      var initProps = config !== null && config !== void 0 && config.width && config !== null && config !== void 0 && config.height ? {
        width: config.width,
        height: config.height
      } : {};
      var chart = init(chartRef.current, (config === null || config === void 0 ? void 0 : config.theme) || null, _extends({
        renderer: (config === null || config === void 0 ? void 0 : config.renderer) || 'canvas'
      }, initProps));
      setChartInstance(chart);
    }
    var options = {};
    if (!Object.keys(rawConfig).length) {
      var horizontal = false;
      if (config !== null && config !== void 0 && config.horizontal) {
        horizontal = config.horizontal;
      }
      var itemStyle = {
        color: null,
        borderColor: null,
        borderWidth: null,
        borderType: null,
        opacity: null
      };
      if (config !== null && config !== void 0 && config.itemStyle) {
        itemStyle = _extends({}, config.itemStyle);
      }
      var overrideItemStyle = Object.keys(filterObjNullValue(itemStyle)).length ? {
        itemStyle: filterObjNullValue(itemStyle)
      } : {};
      var _normalizeData = normalizeData(data),
        dimensions = _normalizeData.dimensions,
        source = _normalizeData.source;
      var transformedConfig = transformConfig(_extends({}, config, {
        dimensions: dimensions
      }));
      options = _extends({}, transformedConfig, {
        dataset: {
          dimensions: dimensions,
          source: source
        }
      }, getOptions({
        dimensions: dimensions,
        transformedConfig: transformedConfig,
        overrideItemStyle: overrideItemStyle,
        horizontal: horizontal
      }));
    } else {
      options = rawConfig !== null && rawConfig !== void 0 && rawConfig.series ? _extends({}, rawConfig, {
        series: rawConfig.series.map(function (s) {
          return _extends({}, rawOverrides, s, {
            type: (rawOverrides === null || rawOverrides === void 0 ? void 0 : rawOverrides.type) || (s === null || s === void 0 ? void 0 : s.type)
          });
        })
      }) : rawConfig;
    }
    if (chartInstance) {
      try {
        chartInstance.clear();
        chartInstance.setOption(options);
      } catch (err) {
        console.error('useECharts', err);
      }
    }
  }, [chartInstance, chartRef, config, rawConfig, data, rawOverrides, getOptions]);
  return [chartRef, chartInstance];
};

var styles = {"container":"ae-container","legend":"ae-legend"};

var _getOptions = function getOptions(_ref) {
  var _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal,
    _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions,
    overrideItemStyle = _ref.overrideItemStyle;
  var series = dimensions.slice(1).map(function (dim) {
    return _extends({
      name: dim,
      type: 'bar',
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    }, overrideItemStyle);
  });
  return {
    series: series
  };
};
var Bar = function Bar(_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    rawConfig = _ref2.rawConfig;
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'bar'
      },
      rawConfig: rawConfig,
      config: config,
      data: data,
      getOptions: function getOptions(_ref3) {
        var dimensions = _ref3.dimensions,
          overrideItemStyle = _ref3.overrideItemStyle,
          horizontal = _ref3.horizontal;
        return _getOptions({
          horizontal: horizontal,
          dimensions: dimensions,
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var Bar$1 = forwardRef(Bar);

var _getOptions$1 = function getOptions(_ref) {
  var _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal,
    _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions,
    overrideItemStyle = _ref.overrideItemStyle;
  var series = dimensions.slice(1).map(function (dim) {
    return _extends({
      name: dim,
      type: 'line',
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    }, overrideItemStyle);
  });
  return {
    series: series
  };
};
var Line = function Line(_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    rawConfig = _ref2.rawConfig;
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'line'
      },
      rawConfig: rawConfig,
      config: config,
      data: data,
      getOptions: function getOptions(_ref3) {
        var dimensions = _ref3.dimensions,
          overrideItemStyle = _ref3.overrideItemStyle,
          horizontal = _ref3.horizontal;
        return _getOptions$1({
          horizontal: horizontal,
          dimensions: dimensions,
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var Line$1 = forwardRef(Line);

var _getOptions$2 = function getOptions(_ref) {
  var _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions,
    overrideItemStyle = _ref.overrideItemStyle;
  var itemName = dimensions[0];
  var value = dimensions.slice(1);
  return {
    series: [_extends({
      type: 'pie',
      radius: '60%',
      encode: {
        itemName: itemName,
        value: value
      }
    }, overrideItemStyle)]
  };
};
var Pie = function Pie(_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    rawConfig = _ref2.rawConfig;
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'pie'
      },
      rawConfig: rawConfig,
      config: _extends({}, config, {
        showAxis: false
      }),
      data: data,
      getOptions: function getOptions(_ref3) {
        var dimensions = _ref3.dimensions,
          overrideItemStyle = _ref3.overrideItemStyle;
        return _getOptions$2({
          dimensions: dimensions,
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var Pie$1 = forwardRef(Pie);

var MAX = 60;
var _getOptions$3 = function getOptions(_ref) {
  var _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions,
    radius = _ref.radius,
    overrideItemStyle = _ref.overrideItemStyle;
  var itemName = dimensions[0];
  var value = dimensions.slice(1);
  return {
    series: [_extends({
      type: 'pie',
      radius: radius,
      encode: {
        itemName: itemName,
        value: value
      }
    }, overrideItemStyle)]
  };
};
var Doughnut = function Doughnut(_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$size = _ref2.size,
    size = _ref2$size === void 0 ? 40 : _ref2$size,
    rawConfig = _ref2.rawConfig;
  var torus = useMemo(function () {
    if (size >= MAX) {
      return 0;
    }
    return MAX - size;
  }, [size]);
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'pie',
        radius: [torus + "%", MAX + "%"]
      },
      rawConfig: rawConfig,
      config: _extends({}, config, {
        showAxis: false
      }),
      data: data,
      getOptions: function getOptions(_ref3) {
        var dimensions = _ref3.dimensions,
          overrideItemStyle = _ref3.overrideItemStyle;
        return _getOptions$3({
          dimensions: dimensions,
          radius: [torus + "%", MAX + "%"],
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var Doughnut$1 = forwardRef(Doughnut);

var scatterTransform = function scatterTransform(input) {
  if (Array.isArray(input)) {
    if (Array.isArray(input[0])) {
      return input.map(function (_ref) {
        var label = _ref[0],
          x = _ref[1],
          y = _ref[2];
        return [x, y, label];
      });
    }
    if (typeof input[0] === 'object' && !Array.isArray(input[0])) {
      return input.map(function (_ref2) {
        var label = _ref2.label,
          x = _ref2.x,
          y = _ref2.y;
        return [x, y, label];
      });
    }
  }
  if (typeof input === 'object') {
    return Object.keys(input).map(function (key) {
      return [].concat(input[key], [key]);
    });
  }
  throw new Error('Invalid input format');
};
var _getOptions$4 = function getOptions(_ref3) {
  var data = _ref3.data,
    symbolSize = _ref3.symbolSize,
    showLabel = _ref3.showLabel,
    transformedConfig = _ref3.transformedConfig,
    overrideItemStyle = _ref3.overrideItemStyle;
  return {
    series: [_extends({
      type: 'scatter',
      symbolSize: symbolSize,
      emphasis: {
        focus: 'self'
      },
      label: {
        show: showLabel,
        formatter: function formatter(p) {
          return p.data[2];
        },
        minMargin: 10,
        position: 'top'
      }
    }, overrideItemStyle)],
    xAxis: _extends({}, transformedConfig.xAxis, {
      splitLine: {
        show: true
      }
    }),
    dataset: {
      source: data ? scatterTransform(data) : []
    }
  };
};
var ScatterPlot = function ScatterPlot(_ref4, ref) {
  var config = _ref4.config,
    data = _ref4.data,
    _ref4$symbolSize = _ref4.symbolSize,
    symbolSize = _ref4$symbolSize === void 0 ? 10 : _ref4$symbolSize,
    _ref4$showLabel = _ref4.showLabel,
    showLabel = _ref4$showLabel === void 0 ? true : _ref4$showLabel,
    rawConfig = _ref4.rawConfig;
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'scatter'
      },
      rawConfig: rawConfig,
      config: config,
      getOptions: function getOptions(_ref5) {
        var transformedConfig = _ref5.transformedConfig,
          overrideItemStyle = _ref5.overrideItemStyle;
        return _getOptions$4({
          data: data,
          symbolSize: symbolSize,
          showLabel: showLabel,
          transformedConfig: transformedConfig,
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var ScatterPlot$1 = forwardRef(ScatterPlot);

var _getOptions$5 = function getOptions(_ref) {
  var dimensions = _ref.dimensions,
    stackMapping = _ref.stackMapping,
    transformedConfig = _ref.transformedConfig,
    horizontal = _ref.horizontal,
    overrideItemStyle = _ref.overrideItemStyle;
  var dimensionToStackMap = {};
  Object.keys(stackMapping).forEach(function (stackGroup) {
    stackMapping[stackGroup].forEach(function (dim) {
      dimensionToStackMap[dim] = stackGroup;
    });
  });
  var series = dimensions.slice(1).map(function (dim) {
    return _extends({
      name: dim,
      type: 'bar',
      stack: dimensionToStackMap[dim] || 'defaultStack',
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    }, overrideItemStyle);
  });
  return {
    tooltip: _extends({}, transformedConfig.tooltip, {
      trigger: 'axis'
    }),
    series: series
  };
};
var StackBar = function StackBar(_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    _ref2$stackMapping = _ref2.stackMapping,
    stackMapping = _ref2$stackMapping === void 0 ? {} : _ref2$stackMapping,
    rawConfig = _ref2.rawConfig;
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'bar',
        stack: 'defaultStack'
      },
      rawConfig: rawConfig,
      config: config,
      data: data,
      getOptions: function getOptions(_ref3) {
        var dimensions = _ref3.dimensions,
          transformedConfig = _ref3.transformedConfig,
          overrideItemStyle = _ref3.overrideItemStyle,
          horizontal = _ref3.horizontal;
        return _getOptions$5({
          dimensions: dimensions,
          stackMapping: stackMapping,
          horizontal: horizontal,
          transformedConfig: transformedConfig,
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var StackBar$1 = forwardRef(StackBar);

var _getOptions$6 = function getOptions(_ref) {
  var transformedConfig = _ref.transformedConfig,
    _ref$horizontal = _ref.horizontal,
    horizontal = _ref$horizontal === void 0 ? false : _ref$horizontal,
    _ref$dimensions = _ref.dimensions,
    dimensions = _ref$dimensions === void 0 ? [] : _ref$dimensions,
    overrideItemStyle = _ref.overrideItemStyle;
  var series = dimensions.slice(1).map(function (dim) {
    return _extends({
      name: dim,
      type: 'bar',
      barGap: 0,
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    }, overrideItemStyle);
  });
  return {
    tooltip: _extends({}, transformedConfig.tooltip, {
      trigger: 'axis'
    }),
    series: series
  };
};
var StackClusterColumn = function StackClusterColumn(_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    rawConfig = _ref2.rawConfig;
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'bar',
        barGap: 0
      },
      rawConfig: rawConfig,
      config: config,
      data: data,
      getOptions: function getOptions(_ref3) {
        var dimensions = _ref3.dimensions,
          transformedConfig = _ref3.transformedConfig,
          overrideItemStyle = _ref3.overrideItemStyle,
          horizontal = _ref3.horizontal;
        return _getOptions$6({
          horizontal: horizontal,
          dimensions: dimensions,
          transformedConfig: transformedConfig,
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var StackClusterColumn$1 = forwardRef(StackClusterColumn);

var _getOptions$7 = function getOptions(_ref) {
  var _extends2;
  var dimensions = _ref.dimensions,
    transformedConfig = _ref.transformedConfig,
    horizontal = _ref.horizontal,
    overrideItemStyle = _ref.overrideItemStyle;
  var axis = horizontal ? 'yAxis' : 'xAxis';
  var series = dimensions.slice(1).map(function (dim) {
    return _extends({
      name: dim,
      type: 'line',
      stack: 'defaultStack',
      areaStyle: {},
      encode: {
        x: horizontal ? dim : 'category',
        y: horizontal ? 'category' : dim
      }
    }, overrideItemStyle);
  });
  return _extends({}, transformedConfig, (_extends2 = {
    tooltip: _extends({}, transformedConfig.tooltip, {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    })
  }, _extends2[axis] = _extends({}, transformedConfig[axis], {
    boundaryGap: false
  }), _extends2.series = series, _extends2));
};
var StacLine = function StacLine(_ref2, ref) {
  var config = _ref2.config,
    data = _ref2.data,
    rawConfig = _ref2.rawConfig;
  var _useECharts = useECharts({
      rawOverrides: {
        type: 'line',
        stack: 'defaultStack'
      },
      rawConfig: rawConfig,
      config: config,
      data: data,
      getOptions: function getOptions(_ref3) {
        var dimensions = _ref3.dimensions,
          transformedConfig = _ref3.transformedConfig,
          overrideItemStyle = _ref3.overrideItemStyle,
          horizontal = _ref3.horizontal;
        return _getOptions$7({
          dimensions: dimensions,
          horizontal: horizontal,
          transformedConfig: transformedConfig,
          overrideItemStyle: overrideItemStyle
        });
      }
    }),
    chartRef = _useECharts[0],
    chartInstance = _useECharts[1];
  useImperativeHandle(ref, function () {
    return chartInstance;
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};
var StackLine = forwardRef(StacLine);

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var LeafletContext = createContext(null);
var LeafletProvider = forwardRef(function (_ref, ref) {
  var children = _ref.children,
    width = _ref.width,
    height = _ref.height;
  var mapRef = useRef(null);
  var mapContainer = useRef(null);
  useEffect(function () {
    if (!mapRef.current) {
      var map = L$1.map(mapContainer.current, {
        center: [0, 0],
        zoom: 2
      });
      mapRef.current = map;
    }
    return function () {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  useImperativeHandle(ref, function () {
    return {
      getMap: function getMap() {
        return mapRef.current;
      }
    };
  });
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: mapContainer,
    style: {
      height: height || '100vh',
      width: width || '100%'
    },
    "data-testid": "map-view"
  }), /*#__PURE__*/React.createElement(LeafletContext.Provider, {
    value: mapRef
  }, children));
});
var useLeaflet = function useLeaflet() {
  return useContext(LeafletContext);
};

var _excluded = ["latlng", "label", "icon", "markerLayer"];
var Marker = function Marker(_ref) {
  var _ref$latlng = _ref.latlng,
    latlng = _ref$latlng === void 0 ? null : _ref$latlng,
    _ref$label = _ref.label,
    label = _ref$label === void 0 ? null : _ref$label,
    _ref$icon = _ref.icon,
    icon = _ref$icon === void 0 ? {} : _ref$icon,
    markerLayer = _ref.markerLayer,
    options = _objectWithoutPropertiesLoose(_ref, _excluded);
  var _useState = useState(true),
    preload = _useState[0],
    setPreload = _useState[1];
  var mapRef = useLeaflet();
  var defaultIcon = typeof mIcon === 'object' ? mIcon === null || mIcon === void 0 ? void 0 : mIcon.src : mIcon;
  var defaultShadow = typeof mShadow === 'object' ? mShadow === null || mShadow === void 0 ? void 0 : mShadow.src : mShadow;
  var Icon = L$1.icon({
    iconUrl: (icon === null || icon === void 0 ? void 0 : icon.url) || defaultIcon,
    shadowUrl: (icon === null || icon === void 0 ? void 0 : icon.shadow) || defaultShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var setMarker = useCallback(function () {
    if (mapRef.current && preload) {
      setPreload(false);
      var mapLayer = markerLayer || mapRef.current;
      var marker = L$1.marker(latlng, _extends({
        icon: Icon
      }, options)).addTo(mapLayer);
      if (label) {
        marker.bindPopup(label);
      }
    }
  }, [Icon, mapRef, preload, label, latlng, options, markerLayer]);
  useEffect(function () {
    setMarker();
  }, [setMarker]);
  return null;
};

var _excluded$1 = ["url"];
var TileLayer = function TileLayer(_ref) {
  var url = _ref.url,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  var mapRef = useLeaflet();
  useEffect(function () {
    if (mapRef.current) {
      if (url) {
        L$1.tileLayer(url, _extends({}, props)).addTo(mapRef.current);
      }
    }
  }, [mapRef, props, url]);
  return null;
};

var GeoJson = function GeoJson(_ref) {
  var onClick = _ref.onClick,
    onMouseOver = _ref.onMouseOver,
    _ref$data = _ref.data,
    data = _ref$data === void 0 ? {} : _ref$data,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style;
  var _useState = useState(null),
    layer = _useState[0],
    setLayer = _useState[1];
  var mapRef = useLeaflet();
  var loadGeoJson = useCallback(function () {
    if (mapRef.current && data !== null && data !== void 0 && data.type && (data === null || data === void 0 ? void 0 : data.type) !== 'Topology' && !layer) {
      try {
        var gl = L$1.geoJSON(data, {
          onEachFeature: function onEachFeature(_, layer) {
            if (typeof onClick === 'function') {
              layer.on({
                click: function click(props) {
                  onClick(props);
                }
              });
            }
            if (typeof onMouseOver === 'function') {
              layer.on({
                mouseover: function mouseover(props) {
                  onMouseOver(props);
                }
              });
            }
          }
        });
        setLayer(gl);
        gl.addTo(mapRef.current);
      } catch (err) {
        console.error('GeoJson', err);
      }
    }
    if (layer) {
      layer.resetStyle();
      layer.setStyle(function (feature) {
        return typeof style === 'function' ? style(feature) : _extends({}, style, {
          fillOpacity: parseFloat((style === null || style === void 0 ? void 0 : style.fillOpacity) || 0.2, 10)
        });
      });
    }
  }, [mapRef, layer, data, style, onClick, onMouseOver]);
  useEffect(function () {
    loadGeoJson();
  }, [loadGeoJson]);
  return null;
};

var _excluded$2 = ["onClick", "onMouseOver", "mapKey", "choropleth", "color", "style"];
var calculateRanges = function calculateRanges(data, numRanges) {
  if (data === void 0) {
    data = [];
  }
  if (numRanges === void 0) {
    numRanges = 1;
  }
  var sortedData = data.slice().sort(function (a, b) {
    return a - b;
  });
  if (sortedData.length === 0) return [];
  var minRange = Math.min.apply(Math, sortedData);
  var maxRange = Math.max.apply(Math, sortedData);
  var logMin = Math.log10(minRange);
  var logMax = Math.log10(maxRange);
  var logStep = (logMax - logMin) / numRanges;
  var ranges = [];
  for (var i = 0; i < numRanges; i++) {
    var rangeStart = Math.pow(10, logMin + i * logStep);
    var rangeEnd = i === numRanges - 1 ? maxRange : Math.pow(10, logMin + (i + 1) * logStep);
    ranges.push([Math.floor(rangeStart), Math.floor(rangeEnd)]);
  }
  return ranges;
};
var getColor = function getColor(ranges, value, colors) {
  var _colors;
  if (ranges === void 0) {
    ranges = [];
  }
  if (value === void 0) {
    value = 0;
  }
  if (colors === void 0) {
    colors = [];
  }
  var numColors = colors.length;
  if (numColors === 0) return '#FFFFFF';
  var findIndex = ranges.findIndex(function (r) {
    var min = r[0],
      max = r[1];
    return value >= min && value <= max;
  });
  return ((_colors = colors) === null || _colors === void 0 ? void 0 : _colors[findIndex]) || colors[0];
};
var getGeoJSONProps = function getGeoJSONProps(mapInstance, _ref, data) {
  var _onClick = _ref.onClick,
    _onMouseOver = _ref.onMouseOver,
    mapKey = _ref.mapKey,
    choropleth = _ref.choropleth,
    color = _ref.color,
    _style = _ref.style,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  if (data === void 0) {
    data = [];
  }
  var allProps = _extends({}, props, {
    style: _style
  });
  if (typeof _onClick === 'function') {
    allProps = _extends({}, allProps, {
      onClick: function onClick(props) {
        try {
          _onClick(mapInstance.current.getMap(), props);
        } catch (err) {
          console.error('GeoJson|onClick', err);
        }
      }
    });
  }
  if (typeof _onMouseOver === 'function') {
    allProps = _extends({}, allProps, {
      onMouseOver: function onMouseOver(props) {
        try {
          _onMouseOver(mapInstance.current.getMap(), props);
        } catch (err) {
          console.error('GeoJson|onMouseOver', err);
        }
      }
    });
  }
  if (mapKey && choropleth) {
    allProps = _extends({}, allProps, {
      style: function style(feature) {
        var _data, _data2;
        var findData = (_data = data) === null || _data === void 0 ? void 0 : _data.find(function (d) {
          var _feature$properties;
          return (d === null || d === void 0 ? void 0 : d[mapKey]) === (feature === null || feature === void 0 ? void 0 : (_feature$properties = feature.properties) === null || _feature$properties === void 0 ? void 0 : _feature$properties[mapKey]);
        });
        var value = (findData === null || findData === void 0 ? void 0 : findData[choropleth]) || 0;
        var values = (_data2 = data) === null || _data2 === void 0 ? void 0 : _data2.map(function (d) {
          return d === null || d === void 0 ? void 0 : d[choropleth];
        });
        var ranges = calculateRanges(values, color === null || color === void 0 ? void 0 : color.length);
        return _extends({}, _style, {
          fillColor: getColor(ranges, value, color)
        });
      }
    });
  }
  return allProps;
};

var LegendControl = function LegendControl(_ref) {
  var _ref$data = _ref.data,
    data = _ref$data === void 0 ? [] : _ref$data,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? [] : _ref$color;
  var mapRef = useLeaflet();
  var legendRef = useRef(null);
  var loadLegend = useCallback(function () {
    if (mapRef !== null && mapRef !== void 0 && mapRef.current && !(legendRef !== null && legendRef !== void 0 && legendRef.current)) {
      legendRef.current = L$1.control({
        position: 'bottomright'
      });
    }
    if (legendRef !== null && legendRef !== void 0 && legendRef.current && mapRef !== null && mapRef !== void 0 && mapRef.current) {
      mapRef.current.removeControl(legendRef.current);
      legendRef.current.onAdd = function () {
        var div = L$1.DomUtil.create('div', styles.legend);
        var grades = calculateRanges(data, color.length);
        grades.forEach(function (g, gx) {
          var min = g[0],
            max = g[1];
          div.innerHTML += "<span class=\"icon\" style=\"background-color: " + (color === null || color === void 0 ? void 0 : color[gx]) + ";\"></span> " + min + " - " + max + " <br/>";
        });
        return div;
      };
      legendRef.current.addTo(mapRef.current);
    }
  }, [mapRef, legendRef, data, color]);
  useEffect(function () {
    loadLegend();
  }, [loadLegend]);
  return null;
};

var string2WindowObj = function string2WindowObj(path) {
  if (path === void 0) {
    path = '';
  }
  var obj = path.split('.').reduce(function (obj, key) {
    return obj && obj[key];
  }, window);
  if (typeof obj === 'undefined') {
    return null;
  }
  return obj;
};

var _excluded$3 = ["url", "source"];
var getGeoJSONList = function getGeoJSONList(d) {
  if (!d) {
    return [];
  }
  if ((d === null || d === void 0 ? void 0 : d.type) === 'Topology') {
    return Object.keys(d.objects).map(function (kd) {
      return feature(d, d.objects[kd]);
    });
  }
  return [d];
};
var MapView = function MapView(_ref, ref) {
  var _data$filter2, _data$map;
  var tile = _ref.tile,
    layer = _ref.layer,
    config = _ref.config,
    data = _ref.data;
  var _useState = useState(null),
    geoData = _useState[0],
    setGeoData = _useState[1];
  var _useState2 = useState(null),
    sourceData = _useState2[0],
    setSourceData = _useState2[1];
  var _useState3 = useState(true),
    preload = _useState3[0],
    setPreload = _useState3[1];
  var _useState4 = useState(null),
    markerLayer = _useState4[0],
    setMakerLayer = _useState4[1];
  var mapInstance = useRef(null);
  var layerURL = layer.url,
    layerSource = layer.source,
    layerProps = _objectWithoutPropertiesLoose(layer, _excluded$3);
  var geoProps = useMemo(function () {
    return getGeoJSONProps(mapInstance, layerProps, data);
  }, [layerProps, data]);
  var loadGeoDataFromURL = useCallback(function () {
    try {
      var _temp2 = function () {
        if (layerURL && !geoData) {
          var _temp = _catch(function () {
            return Promise.resolve(fetch(layerURL)).then(function (res) {
              return Promise.resolve(res.json()).then(function (apiData) {
                if (apiData) {
                  setGeoData(apiData);
                }
              });
            });
          }, function (err) {
            console.error('loadGeoDataFromURL', err);
          });
          if (_temp && _temp.then) return _temp.then(function () {});
        }
      }();
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [layerURL, geoData]);
  useEffect(function () {
    loadGeoDataFromURL();
  }, [loadGeoDataFromURL]);
  useEffect(function () {
    var _data$filter;
    if (mapInstance !== null && mapInstance !== void 0 && mapInstance.current && preload) {
      setPreload(false);
      if (config !== null && config !== void 0 && config.zoom) {
        mapInstance.current.getMap().setZoom(config.zoom);
      }
      if (config !== null && config !== void 0 && config.center) {
        mapInstance.current.getMap().panTo(config.center);
      }
      var lg = L.layerGroup().addTo(mapInstance.current.getMap());
      setMakerLayer(lg);
    }
    if (!sourceData) {
      if (typeof layerSource === 'string' && layerSource !== null && layerSource !== void 0 && layerSource.includes('window')) {
        var windowObj = string2WindowObj(layerSource);
        if (windowObj) {
          setSourceData(windowObj);
        }
      }
      if (typeof layerSource === 'object') {
        setSourceData(layerSource);
      }
    }
    if (markerLayer && (data === null || data === void 0 ? void 0 : (_data$filter = data.filter(function (d) {
      return d === null || d === void 0 ? void 0 : d.point;
    })) === null || _data$filter === void 0 ? void 0 : _data$filter.length) === 0 && markerLayer.getLayers().length) {
      markerLayer.clearLayers();
    }
  }, [mapInstance, preload, sourceData, layerSource, markerLayer, config === null || config === void 0 ? void 0 : config.zoom, config === null || config === void 0 ? void 0 : config.center, data]);
  useImperativeHandle(ref, function () {
    return mapInstance.current;
  });
  return /*#__PURE__*/React.createElement(LeafletProvider, {
    ref: mapInstance,
    width: config === null || config === void 0 ? void 0 : config.width,
    height: config === null || config === void 0 ? void 0 : config.height
  }, /*#__PURE__*/React.createElement(TileLayer, tile), data === null || data === void 0 ? void 0 : (_data$filter2 = data.filter(function (d) {
    return d === null || d === void 0 ? void 0 : d.point;
  })) === null || _data$filter2 === void 0 ? void 0 : _data$filter2.map(function (d, dx) {
    return /*#__PURE__*/React.createElement(Marker, {
      latlng: d === null || d === void 0 ? void 0 : d.point,
      label: d === null || d === void 0 ? void 0 : d.label,
      markerLayer: markerLayer,
      key: dx
    });
  }), getGeoJSONList(geoData).map(function (gd, gx) {
    return /*#__PURE__*/React.createElement(GeoJson, _extends({
      key: gx,
      data: gd
    }, geoProps));
  }), getGeoJSONList(sourceData).map(function (sd, sx) {
    return /*#__PURE__*/React.createElement(GeoJson, _extends({
      key: sx,
      data: sd
    }, geoProps));
  }), /*#__PURE__*/React.createElement(LegendControl, {
    data: data === null || data === void 0 ? void 0 : (_data$map = data.map(function (d) {
      return d === null || d === void 0 ? void 0 : d[layer === null || layer === void 0 ? void 0 : layer.choropleth];
    })) === null || _data$map === void 0 ? void 0 : _data$map.filter(function (d) {
      return d;
    }),
    color: layer === null || layer === void 0 ? void 0 : layer.color
  }));
};
var MapView$1 = forwardRef(MapView);

export { Bar$1 as Bar, Doughnut$1 as Doughnut, Line$1 as Line, MapView$1 as MapView, Pie$1 as Pie, ScatterPlot$1 as ScatterPlot, StackBar$1 as StackBar, StackClusterColumn$1 as StackClusterColumn, StackLine };
//# sourceMappingURL=index.modern.js.map
