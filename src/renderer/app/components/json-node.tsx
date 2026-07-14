import React, { FC, useState } from 'react';

interface Props {
  value: any;
  depth?: number;
}

const PREVIEW_MAX_ENTRIES = 4;
const PREVIEW_MAX_STR_LEN = 24;

function PreviewValue({ value }: { value: any }) {
  if (value === null || value === undefined)
    return <span className="jv-null">{String(value)}</span>;
  if (typeof value === 'string')
    return <span className="jv-string">'{value.length > PREVIEW_MAX_STR_LEN ? value.slice(0, PREVIEW_MAX_STR_LEN) + '…' : value}'</span>;
  if (typeof value === 'number')
    return <span className="jv-number">{value}</span>;
  if (typeof value === 'boolean')
    return <span className="jv-boolean">{String(value)}</span>;
  if (Array.isArray(value))
    return <span className="jv-brace">[…]</span>;
  return <span className="jv-brace">{'{'}&hellip;{'}'}</span>;
}

const JsonNode: FC<Props> = ({ value, depth = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  if (value === null)      return <span className="jv-null">null</span>;
  if (value === undefined) return <span className="jv-null">undefined</span>;
  if (typeof value === 'string')  return <span className="jv-string">"{value}"</span>;
  if (typeof value === 'number')  return <span className="jv-number">{value}</span>;
  if (typeof value === 'boolean') return <span className="jv-boolean">{String(value)}</span>;

  const isArray = Array.isArray(value);
  const entries: [string | number, any][] = isArray
    ? value.map((v: any, i: number) => [i, v])
    : Object.entries(value);
  const open  = isArray ? '[' : '{';
  const close = isArray ? ']' : '}';

  if (entries.length === 0) return <span className="jv-brace">{open}{close}</span>;

  const previewEntries = entries.slice(0, PREVIEW_MAX_ENTRIES);
  const hasMore = entries.length > PREVIEW_MAX_ENTRIES;

  return (
    <span className="jv-node">
      <button className="jv-toggle" onClick={() => setExpanded(e => !e)}>
        {expanded ? '▾' : '▸'}
      </button>
      <span className="jv-brace">{open}</span>
      {expanded ? (
        <>
          <div className="jv-block">
            {entries.map(([key, val]) => (
              <div key={key} className="jv-row">
                <span className="jv-key">{String(key)}</span>
                <span className="jv-colon">: </span>
                <JsonNode value={val} depth={depth + 1} />
                <span className="jv-comma">,</span>
              </div>
            ))}
          </div>
          <span className="jv-brace">{close}</span>
        </>
      ) : (
        <>
          {previewEntries.map(([key, val], i) => (
            <span key={key} className="jv-preview-entry">
              {i > 0 && <span className="jv-comma">, </span>}
              {!isArray && <><span className="jv-key">{String(key)}</span><span className="jv-colon">: </span></>}
              <PreviewValue value={val} />
            </span>
          ))}
          {hasMore && <span className="jv-preview-more"> ...</span>}
          <span className="jv-brace">{close}</span>
        </>
      )}
    </span>
  );
};

export default JsonNode;
