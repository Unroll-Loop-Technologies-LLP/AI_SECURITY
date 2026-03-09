import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, onScan }) {
  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neon">Code Editor</h3>
        <button
          type="button"
          onClick={onScan}
          className="rounded-md border border-neon px-4 py-2 text-sm font-semibold text-neon hover:bg-neon/10"
        >
          Scan Editor Code
        </button>
      </div>
      <Editor
        height="360px"
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        onChange={(value) => onChange(value || '')}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
    </div>
  );
}
