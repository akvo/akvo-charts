'use client';
import { createContext, useContext, useReducer } from 'react';
import { chartTypes } from '../static/config';

const DisplayContext = createContext(null);
const DisplayDispatchContext = createContext(null);

const initalDisplayState = {
  selectedChartType: chartTypes.BAR,
  fullScreen: false,
  reRender: false
};

const displayReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_CHART_TYPE':
      return {
        ...state,
        selectedChartType: action.payload
      };
    case 'FULL_SCREEN':
      return {
        ...state,
        fullScreen: !state.fullScreen
      };
    case 'RERENDER_TRUE':
      return {
        ...state,
        reRender: true
      };
    case 'RERENDER_FALSE':
      return {
        ...state,
        reRender: false
      };
    default:
      throw Error(
        `Unknown action: ${action.type}. Remeber action type must be CAPITAL text.`
      );
  }
};

const DisplayContextProvider = ({ children }) => {
  const [display, dispatch] = useReducer(displayReducer, initalDisplayState);

  return (
    <DisplayContext.Provider value={display}>
      <DisplayDispatchContext.Provider value={dispatch}>
        {children}
      </DisplayDispatchContext.Provider>
    </DisplayContext.Provider>
  );
};

export const useDisplayContext = () => useContext(DisplayContext);
export const useDisplayDispatch = () => useContext(DisplayDispatchContext);

export default DisplayContextProvider;
