const obj2String = (str, replacer = null, space = 2) =>
  JSON.stringify(str, replacer, space).replace(/"([^(")]+)":/g, '$1:');

const importBlocks = {
  bar: `import { Bar } from "akvo-charts";`,
  line: `import { Line } from "akvo-charts";`,
  pie: `import { Pie } from "akvo-charts";`,
  doughnut: `import { Doughnut } from "akvo-charts";`,
  stack: `import { StackBar } from "akvo-charts";`,
  stackCluster: `import { StackClusterColumn } from "akvo-charts";`,
};

const renderImport = (type) => {
  return importBlocks?.[type] || null;
};

const renderCodes = (type, props) => {
  const attributes = Object.keys(props)
    .map((p) =>
      ['config', 'data'].includes(p)
        ? `${p}={${p}}`
        : props?.[p]
          ? typeof props[p] === 'object'
            ? `${p}={${obj2String(props[p], null, 0)}}`
            : `${p}={${props[p]}}`
          : ''
    )
    .join(` `);

  switch (type) {
    case 'bar':
      return `<Bar ${attributes} />`;
    case 'line':
      return `<Line ${attributes} />`;
    case 'pie':
      return `<Pie ${attributes} />`;
    case 'doughnut':
      return `<Doughnut ${attributes} />`;
    case 'stack':
      return `<StackBar ${attributes} />`;
    case 'stackCluster':
      return `<StackClusterColumn ${attributes} />`;
    default:
      return null;
  }
};

const renderVars = ({ config, data }) => {
  if (!config || !data) {
    return null;
  }
  const configStr = obj2String(config);
  const dataStr = obj2String(data);

  const codes = [
    `const config = ${configStr};\n`,
    `const data = ${dataStr};\n`
  ];
  return codes.join('');
};

const codeBlock = ({ type, ...props }) => {
  const codes = [];
  if (renderImport(type)) {
    codes.push(`${renderImport(type)}\n\n`);
  }
  if (renderVars(props)) {
    codes.push(`${renderVars(props)}\n`);
  }

  if (renderCodes(type, props)) {
    return [
      ...codes,
      `const Chart = () => {\n`,
      `\treturn (\n`,
      `\t\t<div>\n`,
      `\t\t\t${renderCodes(type, props)}\n`,
      `\t\t</div>\n`,
      `\t);\n`,
      `};\n\n`,
      `export default Chart;`
    ].join('');
  } else {
    return [
      ...codes,
      `const Chart = () => <div>{/* TODO - Akvo charts */}</div>\n\n`,
      `export default Chart;`
    ].join('');
  }
};

export default codeBlock;
