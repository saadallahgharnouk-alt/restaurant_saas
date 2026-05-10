import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';

/**
 * MenuQR — stylised QR code that points at the public scan menu for a
 * given restaurant (and optionally a specific table).
 *
 * Props:
 *   restaurant : { id, name } required
 *   table      : number | null — adds ?t=N to the URL
 *   baseUrl    : override the origin (handy for preview)
 *   showCard   : if true, renders the full "printable card"
 */
export default function MenuQR({
  restaurant,
  table = null,
  baseUrl,
  showCard = true,
}) {
  const [copied, setCopied] = useState(false);
  const hostRef = useRef(null);
  const qrRef   = useRef(null);

  const origin =
    baseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const menuUrl = useMemo(() => {
    if (!restaurant) return '';
    const base = `${origin}/m/${restaurant.id}`;
    return table ? `${base}?t=${table}` : base;
  }, [origin, restaurant, table]);

  // Build / rebuild QR when URL changes.
  useEffect(() => {
    if (!hostRef.current || !menuUrl) return;

    qrRef.current = new QRCodeStyling({
      width: 260,
      height: 260,
      type: 'canvas',
      data: menuUrl,
      margin: 8,
      dotsOptions: { color: '#1C1814', type: 'rounded' },
      cornersSquareOptions: { color: '#B13D2A', type: 'extra-rounded' },
      cornersDotOptions: { color: '#E86F4E', type: 'dot' },
      backgroundOptions: { color: '#FFFBF1' },
      imageOptions: { crossOrigin: 'anonymous', margin: 4, imageSize: 0.22 },
      image: '/logo-mark.svg',
    });

    hostRef.current.innerHTML = '';
    qrRef.current.append(hostRef.current);
  }, [menuUrl]);

  const downloadPNG = () => {
    if (!qrRef.current) return;
    const safeName = (restaurant?.name || 'restaurant')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const suffix = table ? `-table${table}` : '';
    qrRef.current.download({ name: `qr-${safeName}${suffix}`, extension: 'png' });
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — fine */
    }
  };

  const openPreview = () => {
    if (menuUrl) window.open(menuUrl, '_blank', 'noopener');
  };

  if (!restaurant) {
    return (
      <div className="card" style={{ padding: 28, textAlign: 'center', color: 'var(--ink-mid)' }}>
        Select a restaurant to generate a QR code.
      </div>
    );
  }

  /* ── Bare QR (no outer card) ─────────────────────── */
  if (!showCard) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div ref={hostRef} style={{ borderRadius: 12, overflow: 'hidden' }} />
        <Actions
          copied={copied}
          onCopy={copyUrl}
          onDownload={downloadPNG}
          onPreview={openPreview}
        />
      </div>
    );
  }

  /* ── Printable card preview ──────────────────────── */
  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        animation: 'fadeUp 0.4s var(--ease-out)',
      }}
    >
      {/* Print-ready card face */}
      <div
        style={{
          background: '#FFFBF1',
          color: '#1C1814',
          padding: '28px 28px 22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          position: 'relative',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#B13D2A',
            fontWeight: 500,
          }}
        >
          Scan to order
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: '#1C1814',
            textAlign: 'center',
          }}
        >
          {restaurant.name}
        </h3>

        {table && (
          <span
            style={{
              padding: '4px 14px',
              borderRadius: 99,
              background: 'rgba(232,111,78,0.12)',
              color: '#B13D2A',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              border: '1px solid rgba(232,111,78,0.25)',
            }}
          >
            TABLE {table}
          </span>
        )}

        <div
          ref={hostRef}
          style={{
            borderRadius: 18,
            padding: 12,
            background: '#FFFBF1',
            boxShadow: '0 10px 30px rgba(28,24,20,0.08)',
            border: '1px solid rgba(28,24,20,0.06)',
          }}
        />

        <p
          style={{
            fontSize: 11,
            color: '#6B5E4E',
            textAlign: 'center',
            maxWidth: 240,
            lineHeight: 1.5,
          }}
        >
          Point your phone camera at the code — no app needed.
        </p>

        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            marginTop: 4,
            borderTop: '1px dashed rgba(28,24,20,0.15)',
            fontSize: 10,
            color: '#8A7E6A',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span>Powered by restauhub</span>
          <span>#{String(restaurant.id).padStart(3, '0')}</span>
        </div>
      </div>

      {/* Actions strip (paper-soft) */}
      <div
        style={{
          padding: 18,
          background: 'var(--paper-soft)',
          borderTop: '1px solid var(--rule)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            background: 'var(--paper-mist)',
            border: '1px solid var(--rule)',
            borderRadius: 10,
            padding: '9px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            minWidth: 0,
          }}
        >
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--ink-soft)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
            }}
          >
            {menuUrl}
          </code>
          <button
            className={`btn btn-sm ${copied ? 'btn-ember' : 'btn-ghost'}`}
            onClick={copyUrl}
            style={{ flexShrink: 0 }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <Actions
          copied={copied}
          onCopy={copyUrl}
          onDownload={downloadPNG}
          onPreview={openPreview}
          hideCopy
        />
      </div>
    </div>
  );
}

function Actions({ copied, onCopy, onDownload, onPreview, hideCopy }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', width: '100%' }}>
      <button onClick={onDownload} className="btn btn-ember btn-sm" style={{ flex: 1 }}>
        ↓ Download PNG
      </button>
      <button onClick={onPreview} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
        Preview ↗
      </button>
      {!hideCopy && (
        <button onClick={onCopy} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
          {copied ? '✓ Copied' : 'Copy URL'}
        </button>
      )}
    </div>
  );
}
