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
      yAxisLabel: 'Sales'
    },
    data: basicChartExampleData,
    stackMapping: exampleStackMapping
  },
  mapConfig: {
    data: [
      {
        point: [39.61, -105.02],
        label: 'This is Littleton, CO.'
      }
    ],
    config: {
      center: [39.73, -104.99],
      zoom: 10
    },
    layers: [
      {
        tile: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '© OpenStreetMap'
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
