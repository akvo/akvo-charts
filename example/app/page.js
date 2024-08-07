import 'akvo-charts/dist/index.css';
import dynamic from 'next/dynamic';

import { ChartWrapper } from '../components';

const Sidebar = dynamic(() => import('../components/Sidebar'), { ssr: false });
const Editor = dynamic(() => import('../components/Editor'), {
  ssr: false
});

/**
 * ChartDisplay uses import dynamic because it has a leaflet dependencies that requires a window object.
 */
const ChartDisplay = dynamic(() => import('../components/ChartDisplay'), {
  ssr: false
});

const Home = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-0 overflow-y-hidden">
      <Sidebar />
      <ChartWrapper>
        <ChartDisplay />
      </ChartWrapper>
      <Editor />
    </div>
  );
};

export default Home;
