import React, { useRef, useState } from "react";

const API_BASE = "http://localhost:5000";

export default function Upload() {
  const fileRef = useRef(null);
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [uploading, setUploading] = useState(false);

  // ✅ docs must ALWAYS be an array
  const [docs, setDocs] = useState([]);

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("chunk_size", String(chunkSize));
      form.append("chunk_overlap", String(chunkOverlap));

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Upload failed: " + res.status);
      }

      const data = await res.json();

      if (data.ok) {
        alert(`${file.name} — ${data.chunks} chunks ingested`);

        // ✅ Append uploaded file info to docs array
        setDocs((prev) => [
          ...prev,
          {
            name: file.name,
            chunks: data.chunks,
          },
        ]);
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Upload documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded">
          <label className="block text-sm font-medium mb-2">
            Upload file
          </label>

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt"
            className="mb-2"
          />

          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="p-2 rounded border"
              placeholder="Chunk size"
            />

            <input
              type="number"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className="p-2 rounded border"
              placeholder="Overlap"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-3 rounded bg-indigo-600 text-white px-4 py-2"
          >
            {uploading ? "Uploading..." : "Upload & Ingest"}
          </button>
        </div>

        {/* Ingested docs */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded">
          <h3 className="font-semibold mb-2">
            Ingested documents
          </h3>

          <ul className="space-y-2">
            {docs.length === 0 && (
              <li className="text-slate-400">
                No documents yet
              </li>
            )}

            {docs.map((d, i) => (
              <li
                key={i}
                className="p-2 rounded bg-white dark:bg-slate-800 shadow"
              >
                <div className="font-medium">
                  📄 {d.name}
                </div>
                <div className="text-xs text-slate-500">
                  Chunks: {d.chunks}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
