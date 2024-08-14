'use client';

import { useState } from 'react';
import ReactJson from 'react-json-view';
import { CopyIcon } from './Icons';
import SnackBar from './Snackbar';

const JsonDataDisplay = ({ jsonData }) => {
  const [notify, setNotify] = useState(null);

  const onCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    setNotify(`The chart config has been copied to the clipboard.`);
    setTimeout(() => {
      setNotify(null);
    }, 1000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-20px)] bg-stone-800">
      <div className="sticky top-2 right-2 z-[99] flex gap-2 justify-end">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-1 bg-white hover:bg-gray-200 rounded shadow-md"
          onClick={onCopyClick}
        >
          <CopyIcon />
          <span>Copy</span>
        </button>
      </div>
      <div className=" bg-neutral-800 p-3">
        <ReactJson
          name="props"
          src={jsonData}
          theme="monokai"
          displayDataTypes={false}
          indentWidth={2}
        />
      </div>
      <SnackBar show={notify ? true : false}>{notify}</SnackBar>
    </div>
  );
};

export default JsonDataDisplay;
