'use client';

import { useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

import SnackBar from '../Snackbar';
import { useDisplayContext } from '../../context/DisplayContextProvider';
import { codeBlock } from '../../utils';

import 'highlight.js/styles/default.css';
import './styles.css';
import { CopyIcon } from '../Icons';

hljs.registerLanguage('javascript', javascript);

const createHighlight = (content, language) => {
  let lineNumber = 0;
  const highlightedContent = hljs.highlightAuto(content, [language]).value;

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

const CodeDisplay = ({ jsonData = {}, isRaw = false }) => {
  const [show, setShow] = useState(false);

  const { selectedChartType: type } = useDisplayContext();

  const code = isRaw
    ? codeBlock({ type, rawConfig: jsonData })
    : codeBlock({ type, ...jsonData });

  const handleOnCopy = () => {
    navigator.clipboard.writeText(code);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 1000);
  };

  return (
    <div className="relative w-full bg-gray-100 pb-3">
      <div className="sticky top-2 right-2 z-[99] flex gap-2 justify-end">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-1 bg-white hover:bg-gray-200 rounded shadow-md"
          onClick={handleOnCopy}
        >
          <CopyIcon />
          <span>Copy</span>
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
