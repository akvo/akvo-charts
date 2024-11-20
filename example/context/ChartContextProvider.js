'use client';
import { createContext, useContext, useReducer } from 'react';
import {
  basicChartExampleData,
  chartTypes,
  clusterExampleData
} from '../static/config';

const ChartContext = createContext(null);
const ChartDispatchContext = createContext(null);

const defaultMapConfig = {
  tile: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  },
  config: {
    center: [-6.2, 106.816666],
    zoom: 8,
    height: '100vh',
    width: '100%'
  }
};

const initalChartState = {
  rawConfig: {
    [chartTypes.BAR]: {},
    [chartTypes.LINE]: {},
    [chartTypes.PIE]: {},
    [chartTypes.DOUGHNUT]: {},
    [chartTypes.STACK_BAR]: {},
    [chartTypes.STACK_CLUSTER]: {},
    [chartTypes.STACK_LINE]: {},
    [chartTypes.SCATTER_PLOT]: {}
  },
  defaultConfig: {
    config: {
      title: 'Akvo Chart',
      xAxisLabel: 'Product',
      yAxisLabel: 'Sales',
      horizontal: false,
      legend: {
        show: true,
        icon: null,
        top: null,
        left: null,
        align: 'left',
        orient: 'horizontal',
        itemGap: 15
      },
      textStyle: {
        color: null,
        fontStyle: 'normal',
        fontWeight: null,
        fontFamily: 'Arial',
        fontSize: null
      },
      itemStyle: {
        color: null,
        borderColor: '#fff',
        borderWidth: 1,
        borderType: null,
        opacity: 0.6
      },
      color: []
    },
    data: basicChartExampleData,
    stackMapping: {}
  },
  mapConfig: {
    ...defaultMapConfig,
    layer: {
      source: 'window.topoData',
      url: '/static/geojson/indonesia-prov.geojson',
      style: {
        color: '#92400e',
        weight: 1,
        fillColor: '#fbbf24',
        fillOpacity: 0.4
      },
      onClick: '(map, { target }) => map.fitBounds(target._bounds)'
    },
    data: [
      {
        point: [-6.170166, 106.831375],
        label: 'Istiqlal Mosque'
      },
      {
        point: [-6.174596, 106.830407],
        label: 'Gambir Station'
      },
      {
        point: [-6.175414, 106.827175],
        label: 'The National Monument'
      }
    ]
  },
  customMap: {
    [chartTypes.CLUSTER_MAP]: {
      ...defaultMapConfig,
      data: clusterExampleData,
      markerIcon: {
        className: 'custom-marker',
        iconSize: [32, 32],
        html: true
      },
      clusterIcon: {
        className: `custom-marker-cluster`,
        iconSize: 60
      },
      groupKey: 'serviceLevel',
      type: 'circle'
    }
  },
  chartConfig: {
    [chartTypes.BAR]: null,
    [chartTypes.LINE]: null,
    [chartTypes.PIE]: null,
    [chartTypes.DOUGHNUT]: null,
    [chartTypes.STACK_BAR]: null,
    [chartTypes.STACK_CLUSTER]: null,
    [chartTypes.STACK_LINE]: null,
    [chartTypes.SCATTER_PLOT]: null
  },
  isRaw: false,
  isMap: false,
  isEdited: false
};

const chartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHARTS':
      return {
        ...state,
        chartConfig: {
          ...state.chartConfig,
          ...action.payload
        }
      };
    case 'CLEAR_CHART':
      if (state?.isRaw) {
        return {
          ...state,
          rawConfig: {
            ...state.rawConfig,
            [action?.chartType]: null
          }
        };
      }
      return {
        ...state,
        chartConfig: {
          ...state.chartConfig,
          [action?.chartType]: null
        }
      };
    case 'RESET_MAP':
      return {
        ...state,
        mapConfig: initalChartState.mapConfig
      };
    case 'UPDATE_MAP':
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          ...action.payload
        }
      };
    case 'UPDATE_CHART':
      return {
        ...state,
        chartConfig: {
          ...state.chartConfig,
          [action?.chartType]: action.payload
        }
      };
    case 'RESET_CUSTOM_MAP':
      return {
        ...state,
        customMap: {
          ...state.customMap,
          [action?.chartType]: initalChartState.customMap[action?.chartType]
        }
      };
    case 'SET_CUSTOM_MAP':
      return {
        ...state,
        customMap: {
          ...state.customMap,
          ...action.payload
        }
      };
    case 'UPDATE_CUSTOM_MAP':
      return {
        ...state,
        customMap: {
          ...state.customMap,
          [action?.chartType]: {
            ...state.customMap[action?.chartType],
            ...action.payload
          }
        }
      };
    case 'RAW':
      return {
        ...state,
        isRaw: !state.isRaw
      };
    case 'UPDATE_RAW':
      return {
        ...state,
        rawConfig: action?.chartType
          ? {
              ...state.rawConfig,
              [action.chartType]: action.payload
            }
          : action.payload
      };
    case 'MAP_SHOW':
      return {
        ...state,
        isMap: true
      };
    case 'MAP_HIDE':
      return {
        ...state,
        isMap: false
      };
    case 'SET_EDITED':
      return {
        ...state,
        isEdited: action.payload
      };
    default:
      throw Error(
        `Unknown action: ${action.type}. Remeber action type must be CAPITAL text.`
      );
  }
};

const ChartContextProvider = ({ children }) => {
  const [chart, dispatch] = useReducer(chartReducer, initalChartState);

  return (
    <ChartContext.Provider value={chart}>
      <ChartDispatchContext.Provider value={dispatch}>
        {children}
      </ChartDispatchContext.Provider>
    </ChartContext.Provider>
  );
};

export const useChartContext = () => useContext(ChartContext);
export const useChartDispatch = () => useContext(ChartDispatchContext);

export default ChartContextProvider;
