import AkvoCharts from 'akvo-charts';
import 'akvo-charts/dist/index.css';

const Home = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row px-4 py-4 mx-auto lg:mx-0 mt-16 sm:mt-20 rounded-xl ring-1 ring-gray-200">
      <div className="w-full lg:w-1/2">
        <h1 className="text-3xl font-bold underline">Akvo Charts</h1>
        <AkvoCharts text="Create Chart Library" />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-3">
        <div className="w-full p-3">JSON editable</div>
        <div className="w-full p-3">Text Editor</div>
      </div>
    </div>
  );
};

export default Home;
