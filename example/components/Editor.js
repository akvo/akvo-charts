'use client';

import CodeDisplay from './CodeDisplay';
import JsonDataDisplay from './JsonDataDisplay';
import { useDisplayContext } from '../context/DisplayContextProvider';

const Editor = () => {
  const { showJson, showCode } = useDisplayContext();
  const showAll = showJson && showCode;

  if (!showJson && !showCode) {
    return null;
  }

  return (
    <div className="w-full lg:w-1/2 h-[calc(100vh-20px)] flex flex-col gap-0">
      <div
        className={`w-full bg-neutral-800 border-b border-zinc-300 overflow-y-scroll ${showAll ? 'h-[50%]' : 'h-full'} ${!showJson ? 'hidden animate-fadeIn' : ''} transition-all`}
      >
        <JsonDataDisplay />
      </div>
      <div
        className={`w-full bg-gray-100 overflow-y-scroll ${showAll ? 'h-[50%]' : 'h-full'} ${!showCode ? 'hidden animate-fadeIn' : ''} transition-all`}
      >
        <CodeDisplay />
      </div>
    </div>
  );
};

export default Editor;
