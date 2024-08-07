import { chartTypes } from '../static/config';

const obj2String = (str, replacer = null, space = 2) =>
  JSON.stringify(str, replacer, space).replace(/"([^(")]+)":/g, '$1:');

const importBlocks = {
  [chartTypes.BAR]: `import { ${chartTypes.BAR} } from "akvo-charts";`,
  [chartTypes.LINE]: `import { ${chartTypes.LINE} } from "akvo-charts";`,
  [chartTypes.PIE]: `import { ${chartTypes.PIE} } from "akvo-charts";`,
  [chartTypes.DOUGHNUT]: `import { ${chartTypes.DOUGHNUT} } from "akvo-charts";`,
  [chartTypes.STACK_BAR]: `import { ${chartTypes.STACK_BAR} } from "akvo-charts";`,
  [chartTypes.STACK_CLUSTER]: `import { ${chartTypes.STACK_CLUSTER} } from "akvo-charts";`,
  [chartTypes.SCATTER_PLOT]: `import { ${chartTypes.SCATTER_PLOT} } from "akvo-charts";`,
  [chartTypes.STACK_LINE]: `import { ${chartTypes.STACK_LINE} } from "akvo-charts";`,
  [chartTypes.MAP]: `import { ${chartTypes.MAP} } from "akvo-charts";`
};

const renderImport = (type) => {
  return importBlocks?.[type] || null;
};

const renderCodes = (type, props) => {
  const attributes = Object.keys(props)
    .map((p) =>
      ['config', 'data', 'stackMapping', 'layer', 'tile'].includes(p)
        ? `${p}={${p}}`
        : props?.[p]
          ? typeof props[p] === 'object'
            ? `${p}={${obj2String(props[p], null, 0)}}`
            : `${p}={${props[p]}}`
          : ''
    )
    .join(` `)
    .trim()
    .replace(/\s+/g, ' ');

  switch (type) {
    case chartTypes.BAR:
      return `<Bar ${attributes} />`;
    case chartTypes.LINE:
      return `<Line ${attributes} />`;
    case chartTypes.PIE:
      return `<Pie ${attributes} />`;
    case chartTypes.DOUGHNUT:
      return `<Doughnut ${attributes} />`;
    case chartTypes.STACK_BAR:
      return `<StackBar ${attributes} />`;
    case chartTypes.STACK_CLUSTER:
      return `<StackClusterColumn ${attributes} />`;
    case chartTypes.SCATTER_PLOT:
      return `<ScatterPlot ${attributes} />`;
    case chartTypes.STACK_LINE:
      return `<StackLine ${attributes} />`;
    case chartTypes.MAP:
      return `<MapView ${attributes} />`;
    default:
      return 'Undefined chart type.';
  }
};

const renderVars = ({ config, data, stackMapping, layer, tile }) => {
  if (!config || !data) {
    return null;
  }
  const configStr = obj2String(config);
  const dataStr = obj2String(data);

  const codes = [
    `const config = ${configStr};\n\n`,
    `const data = ${dataStr};\n\n`
  ];

  if (stackMapping) {
    const stackMappingStr = obj2String(stackMapping);
    codes.push(`const stackMapping = ${stackMappingStr};\n\n`);
  }

  if (layer) {
    const layerStr = obj2String(layer);
    codes.push(`const layer = ${layerStr};\n\n`);
  }

  if (tile) {
    const tileStr = obj2String(tile);
    codes.push(`const tile = ${tileStr};\n\n`);
  }

  return codes.join('');
};

const codeBlock = ({ type, ...props }) => {
  const codes = [];
  if (renderImport(type)) {
    codes.push(`${renderImport(type)}\n\n`);
  }
  if (renderVars(props)) {
    codes.push(`${renderVars(props)}`);
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
