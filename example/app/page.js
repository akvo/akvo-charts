import 'akvo-charts/dist/index.css';
import dynamic from 'next/dynamic';

import { CodeDisplay, ChartDisplay } from '../components';

const JsonDataDisplay = dynamic(() => import('../components/JsonDataDisplay'), {
  ssr: false,
  loading: () => <>Loading...</>
});

const Home = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row px-4 py-4 mx-auto lg:mx-0 rounded-xl ring-1 ring-gray-200">
      <div className="w-full lg:w-1/2">
        <ChartDisplay />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-3">
        <div className="w-full p-3">
          <JsonDataDisplay />
        </div>
        <div className="w-full p-3">
          <CodeDisplay />
        </div>
      </div>
    </div>
  );
};

export default Home;
