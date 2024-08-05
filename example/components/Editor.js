'use client';

import { useState } from 'react';
import CodeDisplay from './CodeDisplay';
import JsonDataDisplay from './JsonDataDisplay';
import JsonDataEditor from './JsonDataEditor';
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
            className={`flex-1 py-2 px-4 text-center border-r border-gray-300 last:border-r-0 focus:outline-none transition-colors ${
              activeTab === 'json'
                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            onClick={() => setActiveTab('json')}
          >
            JSON Data
          </button>
        )}
        {showJson && (
          <button
            className={`flex-1 py-2 px-4 text-center border-r border-gray-300 last:border-r-0 focus:outline-none transition-colors ${
              activeTab === 'code-editor'
                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            onClick={() => setActiveTab('code-editor')}
          >
            JSON Editor
          </button>
        )}
        {showCode && (
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
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'json' && showJson && (
          <div className="w-full h-full">
            <JsonDataDisplay />
          </div>
        )}
        {activeTab === 'code-editor' && showJson && (
          <div className="w-full h-full">
            <JsonDataEditor />
          </div>
        )}
        {activeTab === 'code' && showCode && (
          <div className="w-full h-full">
            <CodeDisplay />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
