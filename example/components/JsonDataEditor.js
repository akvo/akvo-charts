'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  useChartContext,
  useChartDispatch
} from '../context/ChartContextProvider';
import { useDisplayContext } from '../context/DisplayContextProvider';
import { BookOpenIcon, TrashIcon } from './Icons';
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
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false
});

const JsonDataEditor = () => {
  const [notify, setNotify] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [initialized, setInitialized] = useState(false);

  const { isRaw, defaultConfig, rawConfig } = useChartContext();
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

  useEffect(() => {
    if (!initialized) {
      const initialContent = JSON.stringify(
        isRaw ? rawConfig : defaultStore,
        null,
        2
      );
      setEditorContent(initialContent);
      setInitialized(true);
    }
  }, [initialized, isRaw, rawConfig, defaultStore]);

  useEffect(() => {
    if (initialized) {
      const updatedContent = JSON.stringify(
        isRaw ? rawConfig : defaultStore,
        null,
        2
      );
      setEditorContent(updatedContent);
    }
  }, [selectedChartType, isRaw, rawConfig, defaultStore, initialized]);

  const handleEditorChange = useCallback(
    (value) => {
      setEditorContent(value);
      try {
        const parsedOptions = JSON.parse(value);
        chartDispatch({
          type: 'SET_EDITED',
          payload: true
        });
        chartDispatch({
          type: 'UPDATE_CHART',
          payload: parsedOptions
        });
      } catch (error) {
        console.error('Invalid JSON:', error);
      }
    },
    [chartDispatch]
  );

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

  const onClearClick = () => {
    try {
      chartDispatch({
        type: 'SET_EDITED',
        payload: false
      });
      chartDispatch({
        type: 'DELETE'
      });
      setRawStore(null);
      setDefaultStore(null); // Clear defaultStore in local storage
      setNotify(`Configuration cleared successfully`);
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
      </div>
      <MonacoEditor
        language="json"
        value={editorContent}
        onChange={handleEditorChange}
      />
      <SnackBar show={notify ? true : false}>{notify}</SnackBar>
    </div>
  );
};

export default JsonDataEditor;
