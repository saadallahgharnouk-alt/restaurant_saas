import React, { useRef, useState } from "react";

/* ───────────────────────────────────────────────────────────────
   MediaUpload (Req 13)
   Reusable upload control for photo URL fields.
   - Accepts image/png, image/jpeg, image/webp
   - Rejects files > 2 MiB (2,097,152 bytes)
   - POSTs to /api/content/media as multipart/form-data
   - On failure, reads file as data:image/*;base64,... fallback
   - Shows image preview when value is non-empty
   ─────────────────────────────────────────────────────────────── */

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 2_097_152; // 2 MiB
const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export default function MediaUpload({ value, onChange, label = "Upload Photo" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    // Validate MIME type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(`Invalid file type: ${file.type}. Accepted: PNG, JPEG, WebP.`);
      resetInput();
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setError(`File too large (${sizeMB} MB). Maximum: 2 MB.`);
      resetInput();
      return;
    }

    setUploading(true);

    // Try API upload first
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/content/media`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          setUploading(false);
          resetInput();
          return;
        }
      }
    } catch {
      // Network error — fall through to base64 fallback
    }

    // Fallback: read as data URI
    try {
      const dataUri = await readAsDataUri(file);
      onChange(dataUri);
    } catch (err) {
      setError("Failed to read file.");
    }

    setUploading(false);
    resetInput();
  }

  function resetInput() {
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleClear() {
    onChange("");
    setError("");
    resetInput();
  }

  return (
    <div style={{ marginTop: 8 }}>
      {/* Preview */}
      {value && (
        <div style={{ marginBottom: 10, position: "relative", display: "inline-block" }}>
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: 160,
              maxHeight: 100,
              borderRadius: 10,
              border: "1px solid var(--rule)",
              objectFit: "cover",
              display: "block",
              background: "var(--surface-2)",
            }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <button
            type="button"
            onClick={handleClear}
            title="Remove image"
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--ember, #FF6B1F)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Upload button */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid var(--rule-strong, rgba(255,255,255,0.15))",
            background: "var(--surface, #15151A)",
            color: "var(--fg-mid, #A5A2A0)",
            fontSize: 13,
            fontWeight: 500,
            cursor: uploading ? "wait" : "pointer",
            opacity: uploading ? 0.6 : 1,
            transition: "background 0.15s",
          }}
        >
          {uploading ? "Uploading…" : label}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>

        <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
          PNG, JPEG, WebP · max 2 MB
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "var(--ember, #FF6B1F)",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

/* ─── Helper ──────────────────────────────────────────────────────────────── */

function readAsDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(file);
  });
}
