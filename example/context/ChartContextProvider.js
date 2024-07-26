'use client';
import { createContext, useContext, useReducer } from 'react';

const ChartContext = createContext(null);
const ChartDispatchContext = createContext(null);

const initalChartState = {
  rawConfig: {},
  defaultConfig: {
    id: null,
    title: 'Akvo Chart',
    type: 'default',
    series: [],
    dataset: []
  },
  mapConfig: {},
  mapRawConfig: {},
  isRaw: false,
  isMap: false
};

const chartReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_MAP':
      if (!action.payload) {
        return state;
      }
      if (state.isRaw) {
        return {
          ...state,
          mapRawConfig: {
            ...state.mapRawConfig,
            ...action.payload
          }
        };
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
    case 'MAP':
      return {
        ...state,
        isMap: !state.isMap
      };
    case 'DELETE':
      return initalChartState;
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
