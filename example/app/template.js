import { Header } from "../components";

const Template = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="w-full relative flex flex-col items-center">
        <div className="w-full relative">{children}</div>
      </div>
    </div>
  );
};

export default Template;
