/**
 * readImageAsDataURL — load a File picked from <input type=file>,
 * downscale it with a canvas, and return a compressed JPEG data URL.
 *
 * Why: we persist images in localStorage (demo mode), so raw 4K
 * phone photos are a non-starter. We clamp to 1600px longest edge
 * and ~0.82 JPEG quality — plenty for web display.
 *
 * Returns { dataUrl, width, height, approxKB }.
 */
export async function readImageAsDataURL(file, {
  maxDim = 1600,
  quality = 0.82,
} = {}) {
  if (!file) throw new Error('No file provided');
  if (!file.type.startsWith('image/')) {
    throw new Error(`Unsupported file type: ${file.type || 'unknown'}`);
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('That image is over 20 MB. Please choose a smaller file.');
  }

  const bitmap = await loadBitmap(file);
  const { width: w0, height: h0 } = bitmap;

  const scale = Math.min(1, maxDim / Math.max(w0, h0));
  const w = Math.round(w0 * scale);
  const h = Math.round(h0 * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, w, h);

  // SVGs & transparent PNGs sometimes behave oddly — fall back to PNG
  // when the file is one of those.
  const isPng = /^image\/(png|svg\+xml|gif)/.test(file.type);
  const mime = isPng ? 'image/png' : 'image/jpeg';
  const dataUrl = canvas.toDataURL(mime, quality);

  return {
    dataUrl,
    width: w,
    height: h,
    approxKB: Math.round((dataUrl.length * 0.75) / 1024),
  };
}

async function loadBitmap(file) {
  if ('createImageBitmap' in window) {
    try { return await createImageBitmap(file); } catch { /* fallthrough */ }
  }
  // Safari < 15 fallback.
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image'));
    };
    img.src = url;
  });
}
