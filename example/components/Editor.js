'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import CodeDisplay from './CodeDisplay';
import JsonDataDisplay from './JsonDataDisplay';
import JsonDataEditor from './JsonDataEditor';
import { useDisplayContext } from '../context/DisplayContextProvider';
import {
  useChartContext,
  useChartDispatch
} from '../context/ChartContextProvider';
import { useLocalStorage } from '../utils';
import {
  basicChart,
  basicChartExampleData,
  chartTypes,
  exampleStackMapping,
  excludeHorizontal,
  excludeStackMapping,
  scatterPlotExampleData,
  stackChartExampleData
} from '../static/config';

const Editor = () => {
  const { isRaw, isMap, rawConfig, defaultConfig, chartConfig, mapConfig } =
    useChartContext();
  const { selectedChartType, fullScreen } =
    useDisplayContext();

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

  const jsonData = useMemo(() => {
    let res = {
      ...defaultConfig,
      config: { horizontal: false, ...defaultConfig.config },
      data: basicChartExampleData
    };
    if (!basicChart.includes(selectedChartType)) {
      res = {
        ...res,
        data: stackChartExampleData
      };
    }
    if (selectedChartType === chartTypes.SCATTER_PLOT) {
      res = {
        ...res,
        data: scatterPlotExampleData
      };
    }
    if (excludeHorizontal.includes(selectedChartType)) {
      const transform = { ...res };
      delete transform.config.horizontal;
      res = transform;
    }
    if (excludeStackMapping.includes(selectedChartType)) {
      const transform2 = { ...res };
      delete transform2.stackMapping;
      res = transform2;
    }
    if (!excludeStackMapping.includes(selectedChartType)) {
      res = { ...res, stackMapping: exampleStackMapping };
    }
    const chartData = isRaw
      ? rawConfig?.[selectedChartType] || {}
      : chartConfig?.[selectedChartType] || res;

    return isMap ? mapConfig : chartData;
  }, [
    defaultConfig,
    chartConfig,
    isMap,
    isRaw,
    mapConfig,
    rawConfig,
    selectedChartType
  ]);

  const firstLoad = useCallback(() => {
    if (preload) {
      setPreload(false);
      chartDispatch({
        type: 'UPDATE_RAW',
        payload: rawStore
      });
      chartDispatch({
        type: 'SET_CHARTS',
        payload: defaultStore
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
        setDefaultStore({
          ...defaultStore,
          [selectedChartType]: chartConfig?.[selectedChartType] || defaultConfig
        });
      }
    }
  };

  const clearData = () => {
    chartDispatch({
      type: 'SET_EDITED',
      payload: false
    });
    if (isMap) {
      chartDispatch({
        type: 'RESET_MAP'
      });
    }
    chartDispatch({
      type: 'CLEAR_CHART',
      chartType: selectedChartType
    });
    setDefaultStore({
      ...chartConfig,
      [selectedChartType]: null
    });
    setRawStore({
      ...rawConfig,
      [selectedChartType]: null
    });
    setMapStore(null);
  };

  useEffect(() => {
    firstLoad();
  }, [firstLoad]);

  if (fullScreen) {
    return null;
  }

  return (
    <div className="w-full lg:w-1/2 h-[calc(100vh-20px)] flex flex-col gap-0">
      <div className="w-full lg:max-w-[845px] flex border-b border-gray-300 bg-gray-200">
        <button
          className={`flex-1 py-2 px-4 text-center border-r border-gray-300 last:border-r-0 focus:outline-none transition-colors ${
            activeTab === 'json-editor'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          onClick={() => setActiveTab('json-editor')}
        >
          Option
        </button>

        <button
          className={`flex-1 py-2 px-4 text-center border-r border-gray-300 last:border-r-0 focus:outline-none transition-colors ${
            activeTab === 'json'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          onClick={() => setActiveTab('json')}
        >
          JSON
        </button>

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
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'json' && (
          <div className="w-full h-full">
            <JsonDataDisplay jsonData={jsonData} />
          </div>
        )}
        {activeTab === 'json-editor' && (
          <div className="w-full h-full">
            <JsonDataEditor {...{ storeData, clearData, jsonData }} />
          </div>
        )}
        {activeTab === 'code' && (
          <div className="w-full h-full">
            <CodeDisplay {...{ jsonData, isRaw }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
