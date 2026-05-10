import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeroCanvas, // kept for the signatures block's subtle accent
  MagneticButton,
  TiltCard,
  AnimatedNumber,
  Reveal,
} from '../components/primitives';
import HeroVideo    from '../components/HeroVideo';
import LocationMap  from '../components/LocationMap';
import { useContent } from '../store/content';

/* ────────────────────────────────────────────────────────────────
   Landing — single-restaurant presentation.
   Hero video → story → signatures → gallery → reviews → location.
   No QR here: the customer lands here cold; the QR lives at the
   end of /menu, where it makes sense to save / share the menu.
   ──────────────────────────────────────────────────────────────── */

export default function Landing() {
  const c = useContent();

  return (
    <>
      {/* ─── Hero (video) ──────────────────────────────────── */}
      <HeroVideo
        src={c.hero.videoSrc}
        poster={c.hero.videoPoster}
        fallbackImage={c.hero.image}
      >
        <div style={{ maxWidth: 760 }}>
          <span
            className="eyebrow"
            style={{ color: 'rgba(245,239,227,0.78)' }}
          >
            {c.hero.eyebrow}
          </span>

          <h1
            className="landing-hero-title"
            style={{ color: 'var(--paper-mist)', marginTop: 14 }}
          >
            {c.hero.title_before}
            <br />
            <em>{c.hero.title_em}</em>&nbsp;
            <span
              dangerouslySetInnerHTML={{ __html: c.hero.title_after }}
            />
          </h1>

          <p
            className="landing-hero-lead"
            style={{ color: 'rgba(245,239,227,0.82)', marginTop: 20 }}
          >
            {c.hero.subtitle}
          </p>

          <div className="landing-hero-cta" style={{ marginTop: 28 }}>
            <MagneticButton
              as={Link}
              to={c.hero.cta_primary?.href || '/menu'}
              className="btn btn-ember btn-lg btn-arrow"
            >
              {c.hero.cta_primary?.label || 'See the menu'}
            </MagneticButton>
            <MagneticButton
              as="a"
              href={c.hero.cta_secondary?.href || '#find'}
              className="btn btn-ghost-ink btn-lg"
              strength={8}
            >
              {c.hero.cta_secondary?.label || 'Find the table'}
            </MagneticButton>
          </div>

          <div
            className="landing-hero-meta"
            style={{ marginTop: 36 }}
          >
            <div>
              <strong style={{ color: 'var(--paper-mist)' }}>
                {c.brand.location_city}
              </strong>
              <span>Where we cook</span>
            </div>
            <div>
              <strong style={{ color: 'var(--paper-mist)' }}>Est. 2024</strong>
              <span>Hay Hassani</span>
            </div>
            <div>
              <strong style={{ color: 'var(--paper-mist)' }}>
                <AnimatedNumber value={12} />
              </strong>
              <span>Tables inside</span>
            </div>
          </div>
        </div>
      </HeroVideo>

      {/* ─── Story ─────────────────────────────────────────── */}
      <section className="story-row">
        <Reveal as="figure" className="story-visual">
          <img src={c.story.image} alt="" />
          {c.story.image_caption && (
            <figcaption>{c.story.image_caption}</figcaption>
          )}
        </Reveal>

        <Reveal as="div">
          <span className="eyebrow">{c.story.eyebrow}</span>
          <h2>
            {c.story.title_before}{' '}
            <em>{c.story.title_em}</em>
            <span dangerouslySetInnerHTML={{ __html: c.story.title_after }} />
          </h2>
          <div className="prose">
            {c.story.paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── Signature dishes ─────────────────────────────── */}
      <SignatureRow />

      {/* ─── Gallery ──────────────────────────────────────── */}
      <section className="gallery-section">
        <Reveal as="div">
          <span className="eyebrow">Inside the room</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px,3.4vw,44px)',
              fontWeight: 440,
              letterSpacing: '-0.025em',
              marginTop: 10,
              color: 'var(--ink)',
            }}
          >
            A few <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>frames</em>.
          </h2>
        </Reveal>

        <Reveal stagger className="gallery-grid stagger">
          {c.gallery.slice(0, 6).map((src, i) => (
            <div key={i} className="gallery-cell">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </Reveal>
      </section>

      {/* ─── Reviews ──────────────────────────────────────── */}
      <section className="quotes-section">
        <Reveal>
          <span className="eyebrow">What people say</span>
          <h2
            className="page-title"
            style={{ marginTop: 10, maxWidth: '18ch' }}
          >
            Three rooms over, <em>one long table</em>.
          </h2>
        </Reveal>

        <Reveal stagger className="quotes-grid stagger">
          {c.reviews.map((q, i) => (
            <TiltCard
              key={i}
              as="article"
              className="quote-card"
              max={5}
            >
              <span className="mark">&ldquo;</span>
              <p dangerouslySetInnerHTML={{ __html: q.quote }} />
              <div className="who">
                <div className="avatar">{q.name.trim()[0] || 'A'}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    {q.name}
                  </div>
                  <small>{q.role}</small>
                </div>
              </div>
            </TiltCard>
          ))}
        </Reveal>
      </section>

      {/* ─── Location ─────────────────────────────────────── */}
      <section id="find" className="location-section">
        <Reveal>
          <span className="eyebrow">Find the table</span>
          <h2
            className="page-title"
            style={{ marginTop: 10, maxWidth: '18ch' }}
          >
            {c.location.line1.split(',')[0]},<br />
            <em>{c.brand.location_city}</em>.
          </h2>
        </Reveal>

        <div className="location-grid">
          <Reveal>
            <div className="location-info">
              <span className="eyebrow">Address</span>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  letterSpacing: '-0.015em',
                  marginTop: 8,
                }}
              >
                {c.location.line1}
              </p>
              <p
                style={{ color: 'var(--ink-mid)', fontSize: 14 }}
              >
                {c.location.line2} · {c.location.country}
              </p>

              <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={`tel:${(c.brand.phone || '').replace(/[^\d+]/g, '')}`}
                  className="btn btn-ghost btn-sm"
                >
                  {c.brand.phone}
                </a>
                <a
                  href={`mailto:${c.brand.email || ''}`}
                  className="btn btn-ghost btn-sm"
                >
                  {c.brand.email}
                </a>
              </div>

              <div style={{ marginTop: 26 }}>
                <span className="eyebrow">Hours</span>
                <div className="location-hours">
                  {c.location.hours.map((h, i) => (
                    <div key={i} className="location-hour">
                      <span className="day">{h.label}</span>
                      <span className="time">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <LocationMap
              lat={c.location.lat}
              lng={c.location.lng}
              title={`${c.brand.name} — map`}
            />
          </Reveal>
        </div>
      </section>

      {/* ─── CTA band ─────────────────────────────────────── */}
      <section className="cta-band">
        <Reveal>
          <div className="cta-inner">
            <div>
              <span
                className="eyebrow"
                style={{ color: 'rgba(245,239,227,0.65)' }}
              >
                Reserve
              </span>
              <h2>
                A table that <em>knew your name</em><br />before you walked in.
              </h2>
              <p>
                Call ahead, or walk in Tuesday through Saturday. We save a
                couple of spots at the counter for neighbours.
              </p>
            </div>

            <div className="cta-aside">
              <MagneticButton
                as="a"
                href={`tel:${(c.brand.phone || '').replace(/[^\d+]/g, '')}`}
                className="btn btn-ember btn-lg btn-arrow"
              >
                Call {c.brand.phone}
              </MagneticButton>
              <MagneticButton
                as={Link}
                to="/menu"
                className="btn btn-ghost-ink btn-lg"
                strength={8}
              >
                Read the menu first
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ───────────────────────────────────────────────────────────── */

function SignatureRow() {
  const c = useContent();
  const items = (c.menu.items || [])
    .filter((i) => i.signature && i.available)
    .slice(0, 3);
  const currency = c.brand.currency || '$';

  if (items.length === 0) return null;

  return (
    <section className="signatures-section">
      <Reveal>
        <span className="eyebrow">{c.signatures.eyebrow}</span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(30px,3.8vw,52px)',
            fontWeight: 440,
            letterSpacing: '-0.025em',
            marginTop: 10,
            color: 'var(--ink)',
            lineHeight: 1.05,
          }}
        >
          {c.signatures.title_before}{' '}
          <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>
            {c.signatures.title_em}
          </em>
          {c.signatures.title_after}
        </h2>
        <p
          style={{
            color: 'var(--ink-mid)',
            fontSize: 17,
            lineHeight: 1.6,
            maxWidth: '50ch',
            marginTop: 16,
          }}
        >
          {c.signatures.subtitle}
        </p>
      </Reveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
          marginTop: 44,
        }}
      >
        {items.map((item) => (
          <TiltCard
            key={item.id}
            as="article"
            className="signature-card"
            max={5}
            glare={false}
          >
            <div className="signature-img">
              {item.image ? (
                <img src={item.image} alt={item.name} loading="lazy" />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--paper-warm)',
                  }}
                />
              )}
              <span className="signature-chip">Signature</span>
            </div>
            <div className="signature-meta">
              <div
                className="signature-name"
                dangerouslySetInnerHTML={{ __html: item.name }}
              />
              <span className="signature-price">
                {currency} {item.price}
              </span>
            </div>
            <p className="signature-desc">{item.description}</p>
          </TiltCard>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 40,
        }}
      >
        <MagneticButton
          as={Link}
          to="/menu"
          className="btn btn-ghost btn-arrow"
        >
          See the full menu
        </MagneticButton>
      </div>
    </section>
  );
}
