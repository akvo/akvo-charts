'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import ReactJson from 'react-json-view';
import {
  useChartContext,
  useChartDispatch
} from '../context/ChartContextProvider';
import { useDisplayContext } from '../context/DisplayContextProvider';
import { BookOpenIcon, CheckIcon, TrashIcon } from './Icons';
import SnackBar from './Snackbar';
import { useLocalStorage } from '../utils';
import {
  excludeHorizontal,
  excludeStackMapping,
  basicChart,
  stackChartExampleData,
  chartTypes,
  scatterPlotExampleData
} from '../static/config';

const JsonDataDisplay = () => {
  const [notify, setNotify] = useState(null);
  const [preload, setPreload] = useState(true);
  const [mapPreload, setMapPreload] = useState(true);

  const { isMap, mapConfig, isRaw, defaultConfig, rawConfig } =
    useChartContext();
  const { selectedChartType } = useDisplayContext();

  const transformDefaultConfig = useMemo(() => {
    let res = { ...defaultConfig };
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
      delete transform.horizontal;
      res = transform;
    }
    if (excludeStackMapping.includes(selectedChartType)) {
      const transform = { ...res };
      delete transform.stackMapping;
      res = transform;
    }
    return res;
  }, [selectedChartType, defaultConfig]);

  const chartDispatch = useChartDispatch();
  const [defaultStore, setDefaultStore] = useLocalStorage(
    'defaultConfig',
    transformDefaultConfig
  );
  const [rawStore, setRawStore] = useLocalStorage('rawConfig', rawConfig);
  const [mapStore, setMapStore] = useLocalStorage('mapConfig', mapConfig);

  const onJsonUpdate = ({ updated_src: payload }) => {
    chartDispatch({
      type: isMap ? 'UPDATE_MAP' : 'UPDATE_CHART',
      payload
    });
  };

  const onRawClick = () => {
    chartDispatch({
      type: 'RAW',
      payload: rawStore
    });
  };

  const handleOnError = (error) => {
    const errorMessage = 'Something went wrong';
    setNotify(errorMessage);
    setTimeout(() => {
      setNotify(null);
    }, 1000);
    console.error(errorMessage, error);
  };

  const onSaveClick = () => {
    try {
      if (isMap) {
        setMapStore(mapConfig);
      } else {
        if (isRaw) {
          setRawStore(rawConfig);
        } else {
          setDefaultStore(transformDefaultConfig);
        }
      }

      setNotify(`Configuration successfully saved`);
      setTimeout(() => {
        setNotify(null);
      }, 1000);
    } catch (error) {
      handleOnError(error);
    }
  };

  const onClearClick = () => {
    try {
      chartDispatch({
        type: 'DELETE'
      });
      setRawStore(null);
      setDefaultStore(null);
      setMapStore(null);
      setNotify(`Configuration cleared successfully`);
      setTimeout(() => {
        setNotify(null);
      }, 1000);
    } catch (error) {
      handleOnError(error);
    }
  };

  const firstLoad = useCallback(() => {
    if (preload) {
      setPreload(false);
      chartDispatch({
        type: 'UPDATE_CHART',
        payload: isRaw ? rawStore : defaultStore
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
    isRaw,
    preload,
    mapPreload,
    isMap,
    mapStore
  ]);

  useEffect(() => {
    firstLoad();
  }, [firstLoad]);

  const chartData = isRaw ? rawConfig : transformDefaultConfig;
  const jsonData = isMap ? mapConfig : chartData;

  return (
    <div className="w-full relative">
      <div className="w-full flex justify-end sticky top-2 right-2 z-[99] rounded-sm text-lg">
        <a
          href={
            isRaw
              ? 'https://echarts.apache.org/en/option.html#title'
              : 'https://github.com/akvo/akvo-charts/blob/main/README.md'
          }
          target="_blank"
          className="w-fit h-auto flex items-center gap-2 px-4 py-1 bg-white hover:bg-gray-200"
          rel="noreferrer"
          data-testid="link-rtd"
        >
          <BookOpenIcon />
          <span>Read Docs</span>
        </a>
        <div className="px-3 py-1 bg-white">
          <input
            type="checkbox"
            id="raw"
            onClick={onRawClick}
          />
          <label
            htmlFor="raw"
            className="mx-1"
          >
            Raw
          </label>
        </div>
        <button
          type="button"
          className="w-fit h-auto flex items-center gap-2 px-4 py-1 bg-white hover:bg-gray-200"
          onClick={onClearClick}
        >
          <TrashIcon />
          <span>Clear</span>
        </button>
        <button
          type="button"
          className="w-fit h-auto flex items-center gap-2 px-4 py-1 text-white bg-blue-600 hover:bg-blue-700"
          onClick={onSaveClick}
        >
          <CheckIcon />
          <span>Save</span>
        </button>
      </div>
      <ReactJson
        name="props"
        src={jsonData}
        theme="monokai"
        displayDataTypes={false}
        onEdit={onJsonUpdate}
        onAdd={onJsonUpdate}
        indentWidth={2}
      />
      <SnackBar show={notify ? true : false}>{notify}</SnackBar>
    </div>
  );
};

export default JsonDataDisplay;
