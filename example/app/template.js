import 'highlight.js/styles/default.css';

const Template = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-full px-6">{children}</div>
    </div>
  );
};

export default Template;
