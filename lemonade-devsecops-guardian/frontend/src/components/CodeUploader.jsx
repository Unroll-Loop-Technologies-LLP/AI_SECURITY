import { useState } from 'react';

export default function CodeUploader({ onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <div className="panel space-y-3">
      <h3 className="text-lg font-semibold text-neon">Upload Code File</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <button
        type="button"
        disabled={!file}
        onClick={() => file && onUpload(file)}
        className="rounded-md bg-neon px-4 py-2 text-sm font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Scan Uploaded File
      </button>
    </div>
  );
}
