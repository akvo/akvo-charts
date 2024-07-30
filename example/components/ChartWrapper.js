'use client';

import { useDisplayContext } from '../context/DisplayContextProvider';

const ChartWrapper = ({ children }) => {
  const { showJson, showCode } = useDisplayContext();
  return (
    <div
      className={`w-full lg:w-1/2 ${(!showJson && !showCode) && 'lg:w-full'} h-1/2 lg:h-[calc(100vh-20px)] bg-white space-y-3 border-r border-zinc-300`}
    >
      {children}
    </div>
  );
};

export default ChartWrapper;
