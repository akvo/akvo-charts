'use client';
import { createContext, useContext, useReducer } from 'react';

const DisplayContext = createContext(null);
const DisplayDispatchContext = createContext(null);

const initalDisplayState = {
  showJson: true,
  showCode: true,
  isRaw: false,
  isMap: false
};

const displayReducer = (state, action) => {
  switch (action.type) {
    case 'JSON':
      return {
        ...state,
        showJson: !state.showJson
      };
    case 'CODE':
      return {
        ...state,
        showCode: !state.showCode
      };
    case 'RAW':
      return {
        ...state,
        isRaw: !state.isRaw
      };
    case 'MAP':
      return {
        ...state,
        isMap: !state.isMap
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
