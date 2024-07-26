'use client';

import { useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

import SnackBar from '../Snackbar';
import { useChartContext } from '../../context/ChartContextProvider';
import { codeBlock } from '../../utils';

import 'highlight.js/styles/default.css';
import './styles.css';
import { CopyIcon } from '../Icons';

hljs.registerLanguage('javascript', javascript);

const createHighlight = (content, languange) => {
  let lineNumber = 0;
  const highlightedContent = hljs.highlightAuto(content, [languange]).value;

  /* Highlight.js wraps comment blocks inside <span class="hljs-comment"></span>.
     However, when the multi-line comment block is broken down into diffirent
     table rows, only the first row, which is appended by the <span> tag, is
     highlighted. The following code fixes it by appending <span> to each line
     of the comment block. */
  const commentPattern = /<span class="hljs-comment">(.|\n)*?<\/span>/g;
  const adaptedHighlightedContent = highlightedContent.replace(
    commentPattern,
    (data) => {
      return data.replace(/\r?\n/g, () => {
        return '\n<span class="hljs-comment">';
      });
    }
  );

  const contentTable = adaptedHighlightedContent
    .split(/\r?\n/)
    .map(
      (lineContent) =>
        `<tr><td class="line-number" data-pseudo-content=${++lineNumber} /><td>${lineContent}</td></tr>`
    )
    .join('');

  return `<pre class="pt-4 ml-[-16px]"><code><table class="code-table">${contentTable}</table></code></pre>`;
};

const CodeDisplay = () => {
  const [show, setShow] = useState(false);

  const { isRaw, defaultConfig, rawConfig } = useChartContext();
  const chartData = isRaw ? rawConfig : defaultConfig;
  const code = codeBlock(chartData);

  const handleOnCopy = () => {
    navigator.clipboard.writeText(code);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 1000);
  };

  return (
    <div className="w-full relative hljs">
      <div className="w-full absolute top-2 right-2 text-right">
        <button onClick={handleOnCopy}>
          <CopyIcon size={20} />
        </button>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: createHighlight(code, 'javascript')
        }}
      />
      <SnackBar show={show}>
        {`The code block content has been copied to the clipboard.`}
      </SnackBar>
    </div>
  );
};

export default CodeDisplay;
