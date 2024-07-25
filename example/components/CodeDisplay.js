'use client';

import { useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import CopyIcon from './Icons/CopyIcon';
import SnackBar from './Snackbar';
import { useChartContext } from '../context/ChartContextProvider';
import { codeBlock } from '../utils';

hljs.registerLanguage('javascript', javascript);

const CodeDisplay = () => {
  const [show, setShow] = useState(false);

  const chartData = useChartContext();
  const code = codeBlock(chartData);
  const myHtml = hljs.highlight(code, { language: 'javascript' }).value;

  const handleOnCopy = () => {
    navigator.clipboard.writeText(code);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 1000);
  };

  return (
    <div className="w-full p-3 relative ring-1 ring-gray-500/50 rounded-md">
      <div className="w-full px-6 py-3 absolute top-0 text-right">
        <button onClick={handleOnCopy}>
          <CopyIcon />
        </button>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: myHtml }} />
      </pre>
      <SnackBar show={show}>
        The code block content has been copied to the clipboard.
      </SnackBar>
    </div>
  );
};

export default CodeDisplay;
