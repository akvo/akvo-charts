'use client';
import ReactJson from 'react-json-view';
import {
  useChartContext,
  useChartDispatch
} from '../context/ChartContextProvider';

const JsonDataDisplay = ({ raw = false, jsonRaw = [] }) => {
  const jsonChart = useChartContext();
  const chartDispatch = useChartDispatch();

  const onJsonEdit = ({ updated_src: payload }) => {
    chartDispatch({
      type: 'UPDATE',
      payload
    });
  };

  const onJsonAdd = ({ updated_src: payload }) => {
    chartDispatch({
      type: 'UPDATE',
      payload
    });
  };

  const onRawClick = (isRaw) => {
    if (isRaw) {
      chartDispatch({
        type: 'DELETE'
      });
    } else {
      chartDispatch({
        type: 'RESET'
      });
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="raw"
        onClick={(e) => onRawClick(e.target.checked)}
      />
      <label for="raw">Raw</label>
      <ReactJson
        src={raw ? jsonRaw : jsonChart}
        theme="monokai"
        displayDataTypes={false}
        onEdit={onJsonEdit}
        onAdd={onJsonAdd}
        indentWidth={2}
      />
    </>
  );
};

export default JsonDataDisplay;
