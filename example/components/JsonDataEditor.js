'use client';

import { useState, useCallback } from 'react';
import {
  useChartContext,
  useChartDispatch
} from '../context/ChartContextProvider';
import { BookOpenIcon, CheckIcon, TrashIcon } from './Icons';
import SnackBar from './Snackbar';
import dynamic from 'next/dynamic';
import { useDisplayContext } from '../context/DisplayContextProvider';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false
});

const JsonDataEditor = ({ storeData, clearData }) => {
  const [notify, setNotify] = useState(null);

  const { isRaw, defaultConfig, rawConfig, isMap, mapConfig } =
    useChartContext();
  const { selectedChartType } = useDisplayContext();
  const content = isMap
    ? mapConfig
    : isRaw
      ? rawConfig?.[selectedChartType] || {}
      : defaultConfig;

  const chartDispatch = useChartDispatch();

  const handleEditorChange = useCallback(
    (value) => {
      try {
        const parsedOptions = JSON.parse(value);
        chartDispatch({
          type: 'SET_EDITED',
          payload: true
        });
        if (isRaw) {
          chartDispatch({
            type: 'UPDATE_RAW',
            chartType: selectedChartType,
            payload: parsedOptions
          });
        } else {
          chartDispatch({
            type: isMap ? 'UPDATE_MAP' : 'UPDATE_CHART',
            payload: parsedOptions
          });
        }
      } catch (error) {
        console.error('Invalid JSON:', error);
      }
    },
    [chartDispatch, isMap, isRaw, selectedChartType]
  );

  const onRawClick = () => {
    chartDispatch({
      type: 'RAW'
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

  const onClearClick = () => {
    try {
      chartDispatch({
        type: 'SET_EDITED',
        payload: false
      });
      chartDispatch({
        type: 'DELETE'
      });
      chartDispatch({
        type: 'RESET_MAP'
      });
      if (typeof clearData === 'function') {
        clearData();
      }
      setNotify(`Configuration cleared successfully`);
      setTimeout(() => {
        setNotify(null);
      }, 1000);
    } catch (error) {
      handleOnError(error);
    }
  };

  const onSaveClick = () => {
    try {
      if (typeof storeData === 'function') {
        storeData();
      }
      setNotify(`Configuration successfully saved`);
      setTimeout(() => {
        setNotify(null);
      }, 1000);
    } catch (error) {
      handleOnError(error);
    }
  };

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
        {!isMap && (
          <div className="flex items-center px-3 py-1 bg-white rounded shadow-md">
            <input
              type="checkbox"
              id="raw"
              onClick={onRawClick}
              checked={isRaw}
            />
            <label
              htmlFor="raw"
              className="mx-1"
            >
              Raw
            </label>
          </div>
        )}
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
      <MonacoEditor
        theme="vs-dark"
        language="json"
        value={JSON.stringify(content, null, 2)}
        onChange={handleEditorChange}
      />
      <SnackBar show={notify ? true : false}>{notify}</SnackBar>
    </div>
  );
};

export default JsonDataEditor;
