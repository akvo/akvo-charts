'use client';
import { createContext, useContext, useReducer } from 'react';
import { exampleStackMapping, basicChartExampleData } from '../static/config';

const ChartContext = createContext(null);
const ChartDispatchContext = createContext(null);

const initalChartState = {
  rawConfig: {},
  defaultConfig: {
    horizontal: false,
    config: {
      title: 'Akvo Chart',
      xAxisLabel: 'Product',
      yAxisLabel: 'Sales',
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
    stackMapping: exampleStackMapping
  },
  mapConfig: {
    data: [
      {
        point: [39.61, -105.02],
        label: 'This is Littleton, CO.',
        groupName: 'Cities'
      },
      {
        point: [39.73, -104.8],
        label: 'This is Aurora, CO.',
        groupName: 'Cities'
      },
      {
        point: [39.68, -105.0],
        label: 'This is Ruby Hill Park',
        groupName: 'Parks'
      }
    ],
    config: {
      center: [39.73, -104.99],
      zoom: 10,
      height: '100vh',
      width: '100%'
    },
    layers: [
      {
        name: 'OpenStreetMap',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      },
      {
        name: 'TOPOStatic',
        source: 'window.features.mapFeatures.baseMap'
      }
    ]
  },
  isRaw: false,
  isMap: false
};

const chartReducer = (state, action) => {
  switch (action.type) {
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
      if (!action.payload) {
        return state;
      }
      if (state.isRaw) {
        return {
          ...state,
          rawConfig: {
            ...state.rawConfig,
            ...action.payload
          }
        };
      }
      return {
        ...state,
        defaultConfig: {
          ...state.defaultConfig,
          ...action.payload
        }
      };
    case 'RAW':
      return {
        ...state,
        isRaw: !state.isRaw,
        rawConfig: action.payload || state.rawConfig
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
    case 'DELETE':
      return { ...initalChartState, isMap: state?.isMap };
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
