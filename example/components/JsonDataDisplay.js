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
    try {
      chartDispatch({
        type: 'DELETE'
      });
      setRawStore(null);
      setDefaultStore(null);
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
  }, [chartDispatch, rawStore, defaultStore, isRaw, preload]);

  useEffect(() => {
    firstLoad();
  }, [firstLoad]);

  return (
    <div className="w-full relative">
      <div className="w-fit flex absolute top-2 right-2 text-right bg-white z-[99] rounded-sm text-lg">
        {isRaw && (
          <a
            href="https://echarts.apache.org/en/option.html#title"
            target="_blank"
            className="w-fit h-auto flex items-center gap-2 px-4 py-1 hover:bg-gray-200"
            rel="noreferrer"
          >
            <BookOpenIcon />
            <span>Read Docs</span>
          </a>
        )}
        <div className="px-3 py-1">
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
          className="w-fit h-auto flex items-center gap-2 px-4 py-1 hover:bg-gray-200"
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
        src={isRaw ? rawConfig : defaultConfig}
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
