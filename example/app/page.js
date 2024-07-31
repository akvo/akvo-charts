import 'akvo-charts/dist/index.css';
import dynamic from 'next/dynamic';

import { ChartDisplay, ChartWrapper } from '../components';

const Editor = dynamic(() => import('../components/Editor'), {
  ssr: false
});

const Home = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-0 overflow-y-hidden">
      <ChartWrapper>
        <ChartDisplay />
      </ChartWrapper>
      <Editor />
    </div>
  );
};

export default Home;
