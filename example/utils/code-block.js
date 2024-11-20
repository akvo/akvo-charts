import { chartTypes } from '../static/config';
import { obj2String } from './string';

const importBlocks = Object.entries(chartTypes).reduce((acc, [key, value]) => {
  acc[value] = `import { ${value} } from "akvo-charts";`;
  return acc;
}, {});

const renderImport = (type) => {
  return importBlocks?.[type] || null;
};

const declarationList = [
  'config',
  'data',
  'stackMapping',
  'layer',
  'tile',
  'rawConfig',
  'markerIcon',
  'clusterIcon'
];

const formatJSX = (code) => {
  return code.replace(/(\s*[\w-]+={[^}]*})/g, '\n\t\t\t$1').trim();
};

const renderCodes = (type, props) => {
  const attributes = Object.keys(props)
    .map((p) =>
      declarationList.includes(p)
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
    case chartTypes.CHOROPLETH_MAP:
      return `<MapView ${attributes} />`;
    case chartTypes.CLUSTER_MAP:
      return `<MapCluster ${attributes} />`;
    default:
      return 'Undefined chart type.';
  }
};

const renderVars = ({ layer, tile, rawConfig, ...vars }) => {
  const codes = [];

  declarationList.forEach((variable) => {
    if (vars[variable]) {
      codes.push(`const ${variable} = ${obj2String(vars[variable])};\n\n`);
    }
  });
  if (layer) {
    const { onClick, ...layerProps } = layer;
    let lp = layerProps;
    if (onClick) {
      try {
        lp = {
          ...layerProps,
          onClick: '[onClick]'
        };
        // eslint-disable-next-line no-new-func
        const onClickFn = new Function(`return ${onClick}`)();
        codes.push(`const onClick = ${onClickFn.toString()};\n`);
      } catch {}
    }
    const layerStr = obj2String(lp).replace(/"\[onClick\]"/g, 'onClick');
    codes.push(`const layer = ${layerStr};\n\n`);
  }

  if (tile) {
    const tileStr = obj2String(tile);
    codes.push(`const tile = ${tileStr};\n\n`);
  }

  if (rawConfig) {
    const rawConfigStr = obj2String(rawConfig);
    codes.push(`const rawConfig = ${rawConfigStr};\n\n`);
  }

  return codes.join('');
};

const codeBlock = (type, props = {}) => {
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
      `\t\t\t${formatJSX(renderCodes(type, props))}\n`,
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
