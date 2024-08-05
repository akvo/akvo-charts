'use client';

import { useState } from 'react';
import CodeDisplay from './CodeDisplay';
import JsonDataDisplay from './JsonDataDisplay';
import { useDisplayContext } from '../context/DisplayContextProvider';

const Editor = () => {
  const { showJson, showCode } = useDisplayContext();
  const [activeTab, setActiveTab] = useState('json');

  if (!showJson && !showCode) {
    return null;
  }

  return (
    <div className="w-full lg:w-1/2 h-[calc(100vh-20px)] flex flex-col gap-0">
      <div className="flex border-b border-gray-300 bg-gray-200">
        {showJson && (
          <button
            className={`flex-1 py-2 px-4 text-center focus:outline-none ${activeTab === 'json' ? 'bg-white border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('json')}
          >
            JSON Data
          </button>
        )}
        {showCode && (
          <button
            className={`flex-1 py-2 px-4 text-center focus:outline-none ${activeTab === 'code' ? 'bg-white border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'json' && showJson && (
          <div className="w-full h-full bg-neutral-800 p-3 overflow-y-auto">
            <JsonDataDisplay />
          </div>
        )}
        {activeTab === 'code' && showCode && (
          <div className="w-full h-full bg-gray-100 p-3 overflow-y-auto">
            <CodeDisplay />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
