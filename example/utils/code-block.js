const importBlocks = {
  default: `import AkvoCharts from "akvo-charts";`
};

const renderImport = (type) => {
  return importBlocks?.[type] || `import AkvoCharts from "akvo-charts";`;
};

const renderCodes = (type = 'default', props) => {
  switch (type) {
    case 'default':
      return `<AkvoCharts text="${props?.title}">`;
    default:
      return '';
  }
};

const codeBlock = ({ type = 'default', ...props }) => {
  return `
      ${renderImport(type)}

      const Chart = () => {
        return (
          <div>
            ${renderCodes(type, props)}
          </div>
        )
      }
    `;
};

export default codeBlock;
