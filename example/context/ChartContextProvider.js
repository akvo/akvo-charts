'use client';
import { createContext, useContext, useReducer } from 'react';

const ChartContext = createContext(null);
const ChartDispatchContext = createContext(null);

const initalChartState = {
  id: null,
  title: 'Akvo Chart',
  type: 'default',
  series: [],
  dataset: []
};

const chartReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        ...action.payload
      };
    case 'RESET':
      return initalChartState;
    case 'DELETE':
      return {};
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
