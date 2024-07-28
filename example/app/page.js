import 'akvo-charts/dist/index.css';
import dynamic from 'next/dynamic';

import { ChartDisplay } from '../components';

const Editor = dynamic(() => import('../components/Editor'), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-0 overflow-y-hidden">
      <div className="w-full h-[calc(100vh-20px)] bg-white space-y-3 border-r border-zinc-300">
        <ChartDisplay />
      </div>
      <Editor />
    </div>
  );
};

export default Home;
