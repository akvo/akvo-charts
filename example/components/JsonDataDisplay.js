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
    <div className="w-full relative">
      <div className="w-fit px-3 py-1 absolute top-2 right-2 text-right bg-white z-[99] rounded-sm">
        <input
          type="checkbox"
          id="raw"
          onClick={(e) => onRawClick(e.target.checked)}
        />
        <label
          htmlFor="raw"
          className="mx-1 text-lg"
        >
          Raw
        </label>
      </div>
      <ReactJson
        src={raw ? jsonRaw : jsonChart}
        theme="monokai"
        displayDataTypes={false}
        onEdit={onJsonEdit}
        onAdd={onJsonAdd}
        indentWidth={2}
      />
    </div>
  );
};

export default JsonDataDisplay;
