'use client';

import { useDisplayContext } from '../context/DisplayContextProvider';

const ChartWrapper = ({ children }) => {
  const { fullScreen } = useDisplayContext();
  return (
    <div
      className={`w-full ${fullScreen ? 'lg:w-full' : 'lg:w-1/2'} h-[60vh] lg:h-[calc(100vh-20px)] bg-white space-y-3 border-r border-zinc-300 text-center`}
    >
      {children}
    </div>
  );
};

export default ChartWrapper;
