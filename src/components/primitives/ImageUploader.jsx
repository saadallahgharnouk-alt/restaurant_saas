import React, { useCallback, useRef, useState } from 'react';
import { readImageAsDataURL } from '../../lib/imageUpload';
import { useToast } from './Toast';

/**
 * <ImageUploader> — drop/click zone that:
 *   1. accepts a File from the user's PC
 *   2. downscales + compresses it
 *   3. gives the parent back a data URL via `onChange(dataUrl)`
 *
 * Also shows the current value (if any) as a preview and offers a "×"
 * to clear it.
 *
 * Props:
 *   value       — current data URL or http(s) URL (for preview)
 *   onChange    — (dataUrl | null) => void
 *   aspect      — CSS aspect ratio, default "4 / 3"
 *   label       — helper caption, default "Upload photo"
 *   className   — extra classes
 */
export default function ImageUploader({
  value,
  onChange,
  aspect = '4 / 3',
  label = 'Upload photo',
  maxDim = 1600,
  className = '',
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const toast = useToast();

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setBusy(true);
      try {
        const { dataUrl, approxKB } = await readImageAsDataURL(file, { maxDim });
        onChange(dataUrl);
        toast.success(`Uploaded (≈${approxKB} KB)`);
      } catch (e) {
        console.error(e);
        toast.error(e.message || 'Upload failed');
      } finally {
        setBusy(false);
      }
    },
    [onChange, toast, maxDim]
  );

  return (
    <div
      className={`image-uploader ${drag ? 'image-uploader--drag' : ''} ${className}`.trim()}
      style={{ aspectRatio: aspect }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
    >
      {value ? (
        <>
          <img
            src={value}
            alt=""
            className="image-uploader-preview"
            draggable={false}
          />
          <div className="image-uploader-hover">
            <button
              type="button"
              className="btn btn-ember btn-sm"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="btn btn-ghost-ink btn-sm"
              onClick={() => onChange(null)}
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="image-uploader-empty"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <div className="image-uploader-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path
                fill="currentColor"
                d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6v2H5v12h12v-6h2zM17 3v3h3v2h-3v3h-2V8h-3V6h3V3h2z"
              />
            </svg>
          </div>
          <span className="image-uploader-empty-label">
            {busy ? 'Processing…' : label}
          </span>
          <span className="image-uploader-empty-sub">
            JPG, PNG, WebP — drag or click
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = ''; // allow re-selecting the same file
        }}
      />
    </div>
  );
}
