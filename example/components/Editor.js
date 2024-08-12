'use client';

import { useState, useEffect, useCallback } from 'react';
import CodeDisplay from './CodeDisplay';
import JsonDataDisplay from './JsonDataDisplay';
import JsonDataEditor from './JsonDataEditor';
import { useDisplayContext } from '../context/DisplayContextProvider';
import {
  useChartContext,
  useChartDispatch
} from '../context/ChartContextProvider';
import { useLocalStorage } from '../utils';

const Editor = () => {
  const { isRaw, isMap, rawConfig, defaultConfig, mapConfig } =
    useChartContext();
  const { showJson, showCode } = useDisplayContext();

  const [preload, setPreload] = useState(true);
  const [mapPreload, setMapPreload] = useState(true);
  const [activeTab, setActiveTab] = useState('json-editor');

  const [defaultStore, setDefaultStore] = useLocalStorage(
    'defaultConfig',
    defaultConfig
  );
  const [rawStore, setRawStore] = useLocalStorage('rawConfig', rawConfig);
  const [mapStore, setMapStore] = useLocalStorage('mapConfig', mapConfig);

  const chartDispatch = useChartDispatch();

  const firstLoad = useCallback(() => {
    if (preload) {
      setPreload(false);
      chartDispatch({
        type: 'UPDATE_CHART',
        payload: defaultStore
      });
      chartDispatch({
        type: 'UPDATE_RAW',
        payload: rawStore
      });
    }
    if (isMap && mapPreload) {
      setMapPreload(false);
      chartDispatch({
        type: 'UPDATE_MAP',
        payload: mapStore
      });
    }
  }, [
    chartDispatch,
    rawStore,
    defaultStore,
    preload,
    mapPreload,
    isMap,
    mapStore
  ]);

  const storeData = () => {
    if (isMap) {
      setMapStore(mapConfig);
    } else {
      if (isRaw) {
        setRawStore(rawConfig);
      } else {
        setDefaultStore(defaultConfig);
      }
    }
  };

  const clearData = () => {
    setDefaultStore(null);
    setRawStore(null);
    setMapStore(null);
  };

  useEffect(() => {
    firstLoad();
  }, [firstLoad]);

  useEffect(() => {
    if (!showCode && activeTab === 'code') {
      setActiveTab('json-editor');
    }
    if (!showJson && activeTab?.includes('json')) {
      setActiveTab('code');
    }
  }, [showJson, showCode, activeTab]);

  if (!showJson && !showCode) {
    return null;
  }

  return (
    <div className="w-full lg:w-1/2 h-[calc(100vh-20px)] flex flex-col gap-0">
      <div className="flex border-b border-gray-300 bg-gray-200">
        {showJson && (
          <button
            className={`flex-1 py-2 px-4 text-center border-r border-gray-300 last:border-r-0 focus:outline-none transition-colors ${
              activeTab === 'json-editor'
                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            onClick={() => setActiveTab('json-editor')}
          >
            JSON Editor
          </button>
        )}
        {showJson && (
          <button
            className={`flex-1 py-2 px-4 text-center border-r border-gray-300 last:border-r-0 focus:outline-none transition-colors ${
              activeTab === 'json'
                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            onClick={() => setActiveTab('json')}
          >
            JSON Data
          </button>
        )}
        {showCode && (
          <button
            className={`flex-1 py-2 px-4 text-center border-r border-gray-300 last:border-r-0 focus:outline-none transition-colors ${
              activeTab === 'code'
                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'json' && showJson && (
          <div className="w-full h-full">
            <JsonDataDisplay />
          </div>
        )}
        {activeTab === 'json-editor' && showJson && (
          <div className="w-full h-full">
            <JsonDataEditor {...{ storeData, clearData }} />
          </div>
        )}
        {(activeTab === 'code' || (showCode && !showJson)) && (
          <div className="w-full h-full">
            <CodeDisplay />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
