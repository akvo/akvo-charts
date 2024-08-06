'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import {
  useChartContext,
  useChartDispatch
} from '../context/ChartContextProvider';
import { BookOpenIcon, CheckIcon, TrashIcon } from './Icons';
import SnackBar from './Snackbar';
import { useLocalStorage } from '../utils';

const JsonDataDisplay = () => {
  const [notify, setNotify] = useState(null);
  const [preload, setPreload] = useState(true);

  const { isRaw, defaultConfig, rawConfig } = useChartContext();

  const chartDispatch = useChartDispatch();
  const [defaultStore, setDefaultStore] = useLocalStorage(
    'defaultConfig',
    defaultConfig
  );
  const [rawStore, setRawStore] = useLocalStorage('rawConfig', rawConfig);

  const onJsonUpdate = ({ updated_src: payload }) => {
    chartDispatch({
      type: 'SET_EDITED',
      payload: true
    });
    chartDispatch({
      type: 'UPDATE_CHART',
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
      if (isRaw) {
        setRawStore(rawConfig);
      } else {
        setDefaultStore(defaultConfig);
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
    let currDefaultStore = window.localStorage.getItem('defaultConfig');
    currDefaultStore = currDefaultStore ? JSON.parse(currDefaultStore) : null;
    try {
      chartDispatch({
        type: 'SET_EDITED',
        payload: false
      });
      chartDispatch({
        type: 'UPDATE_CHART',
        payload: currDefaultStore
      });
      setRawStore(null);
      setDefaultStore(currDefaultStore);
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
        payload: isRaw ? rawStore : defaultConfig
      });
    }
  }, [chartDispatch, rawStore, defaultConfig, isRaw, preload]);

  useEffect(() => {
    firstLoad();
  }, [firstLoad]);

  return (
    <div className="relative w-full h-[calc(100vh-20px)]">
      <div className="absolute top-2 right-2 z-[99] flex gap-2">
        <a
          href={
            isRaw
              ? 'https://echarts.apache.org/en/option.html#title'
              : 'https://github.com/akvo/akvo-charts/blob/main/README.md'
          }
          target="_blank"
          className="flex items-center gap-2 px-4 py-1 bg-white hover:bg-gray-200 rounded shadow-md"
          rel="noreferrer"
          data-testid="link-rtd"
        >
          <BookOpenIcon />
          <span>Read Docs</span>
        </a>
        <div className="flex items-center px-3 py-1 bg-white rounded shadow-md">
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
          className="flex items-center gap-2 px-4 py-1 bg-white hover:bg-gray-200 rounded shadow-md"
          onClick={onClearClick}
        >
          <TrashIcon />
          <span>Clear</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded shadow-md"
          onClick={onSaveClick}
        >
          <CheckIcon />
          <span>Save</span>
        </button>
      </div>
      <div className=" bg-neutral-800 p-3">
        <ReactJson
          name="props"
          src={isRaw ? rawConfig : defaultConfig}
          theme="monokai"
          displayDataTypes={false}
          onEdit={onJsonUpdate}
          onAdd={onJsonUpdate}
          indentWidth={2}
        />
      </div>
      <SnackBar show={notify ? true : false}>{notify}</SnackBar>
    </div>
  );
};

export default JsonDataDisplay;
