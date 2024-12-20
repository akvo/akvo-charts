'use client';
import {
  useDisplayContext,
  useDisplayDispatch
} from '../context/DisplayContextProvider';

const Header = () => {
  const { fullScreen } = useDisplayContext();
  const displayDispatch = useDisplayDispatch();

  return (
    <div className="w-full max-h-[20px] flex items-center justify-between bg-gray-50 border-b border-zinc-300">
      <div className="w-fit flex items-center">
        <img
          alt="github"
          src="https://img.shields.io/badge/Akvo-Charts-009688?logo=github&style=flat-square"
          className="w-full h-auto"
        />
        <img
          src="https://img.shields.io/npm/v/akvo-charts?logo=npm&style=flat-square"
          alt="npm"
        />
      </div>
      <div className="w-fit hidden lg:flex">
        <button
          type="button"
          className="px-4 py-2 leading-3 font-bold rounded-none border-l border-zinc-300 bg-zinc-200 hover:bg-zinc-300"
          onClick={() => {
            displayDispatch({ type: 'FULL_SCREEN' });
            displayDispatch({
              type: 'RERENDER_TRUE'
            });
            setTimeout(() => {
              displayDispatch({
                type: 'RERENDER_FALSE'
              });
            }, 100);
          }}
        >
          {`${fullScreen ? '☑' : '☒'} Full Screen`}
        </button>
      </div>
    </div>
  );
};

export default Header;
