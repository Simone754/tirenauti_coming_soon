/**
 * ImmersiveBoatJourney — 4 fasi
 *
 *  0  img1  Coming Soon
 *  1  img2  10 tappe / 6 regioni / 2 mesi
 *  2  img3  Carosello slide dentro lo schermo TV
 *  3  img4  Entra nella crew + contatti
 *
 * Pure RAF + scroll — zero dipendenze esterne.
 */

import { useEffect, useRef } from "react";
import whiteLogo    from "../../ppt_refs/slide1-white-logo.png";
import logoMark     from "../../assets/tirrenauti-mark.png";
import logoWordmark from "../../assets/1500-miglia-festival-logo.png";
import socialIG  from "../../assets/social-instagram.png";
import socialFB  from "../../assets/social-facebook.png";
import socialWA  from "../../assets/social-whatsapp.png";
import img1 from "../../immagine1.png";
import img2 from "../../immagine2.png";
import img3 from "../../immagine3.png";
import img4 from "../../immagone4.png";
import slide1 from "../../slide1.png";
import slide2 from "../../slide2.png";
import slide3 from "../../slide3.png";
import slide4 from "../../slide4.png";
import slide5 from "../../slide5.png";
import slide6 from "../../slide6.png";

const SLIDES = [slide1, slide2, slide3, slide4, slide5, slide6];

const instagramUrl = "https://www.instagram.com/1500migliafestival/";
const facebookUrl  = "https://www.facebook.com/1500migliafestival/";
const whatsappUrl  = "https://wa.me/";   // TODO: inserire numero WhatsApp
const contactEmail = "info@1500miglia.com";

// ─── Utility ─────────────────────────────────────────────────────────────────

function mr(v: number, a: number, b: number, c: number, d: number): number {
  if (a === b) return v >= a ? d : c;
  return c + (d - c) * Math.max(0, Math.min(1, (v - a) / (b - a)));
}

// ─── Phase data ───────────────────────────────────────────────────────────────

interface Phase {
  img: string;
  alt: string;
  fadeIn:    [number, number];
  peak:      [number, number];
  fadeOut:   [number, number];
  scaleIn:   number;
  scalePeak: number;
  scaleOut:  number;
}

const PHASES: Phase[] = [
  // ── 0  Coming Soon ────────────────────────────────────────────────────────
  {
    img: img1, alt: "Barca a vela al tramonto sul Tirreno",
    fadeIn:   [-0.01, 0.00],
    peak:     [0.00,  0.20],
    fadeOut:  [0.20,  0.27],
    scaleIn: 1.00, scalePeak: 1.05, scaleOut: 1.08,
  },
  // ── 1  Le cifre ────────────────────────────────────────────────────────────
  {
    img: img2, alt: "Vista dal ponte della barca al tramonto",
    fadeIn:   [0.20,  0.27],
    peak:     [0.27,  0.47],
    fadeOut:  [0.47,  0.54],
    scaleIn: 1.06, scalePeak: 1.10, scaleOut: 1.13,
  },
  // ── 2  Salotto (TV carousel) ───────────────────────────────────────────────
  {
    img: img3, alt: "Interno lussuoso della barca — salotto con TV",
    fadeIn:   [0.47,  0.54],
    peak:     [0.54,  0.72],
    fadeOut:  [0.72,  0.79],
    scaleIn: 1.11, scalePeak: 1.14, scaleOut: 1.11,
  },
  // ── 3  Crew + contatti ────────────────────────────────────────────────────
  {
    img: img4, alt: "Barca con vela colorata in navigazione al tramonto",
    fadeIn:   [0.72,  0.79],
    peak:     [0.79,  1.00],
    fadeOut:  [9.0,   9.0], // mai sbiadisce
    scaleIn: 1.10, scalePeak: 1.06, scaleOut: 1.06,
  },
];

// TV carousel range (dentro il peak di Phase 2)
const TV_START = PHASES[2].peak[0]; // 0.54
const TV_END   = PHASES[2].fadeOut[0]; // 0.72
const TV_RANGE = TV_END - TV_START;   // 0.18

// ─── Animation helpers ────────────────────────────────────────────────────────

function imgOpacity(ph: Phase, p: number): number {
  if (p < ph.fadeIn[0])  return 0;
  if (p < ph.fadeIn[1])  return mr(p, ph.fadeIn[0],  ph.fadeIn[1],  0, 1);
  if (p < ph.fadeOut[0]) return 1;
  if (p < ph.fadeOut[1]) return mr(p, ph.fadeOut[0], ph.fadeOut[1], 1, 0);
  return 0;
}

function imgScale(ph: Phase, p: number): number {
  if (p < ph.fadeIn[1])  return mr(p, ph.fadeIn[0],  ph.fadeIn[1],  ph.scaleIn,   ph.scalePeak);
  if (p < ph.fadeOut[0]) return ph.scalePeak;
  if (p < ph.fadeOut[1]) return mr(p, ph.fadeOut[0], ph.fadeOut[1], ph.scalePeak, ph.scaleOut);
  return ph.scaleOut;
}

function textVis(ph: Phase, p: number): { o: number; ty: number } {
  const ti = ph.peak[0] + 0.022;
  const tp = ti + 0.040;
  const to = ph.fadeOut[0] === 9.0 ? 9.0 : ph.fadeOut[0] - 0.012;
  const te = to + 0.030;

  if (p < ti) return { o: 0, ty: 22 };
  if (p < tp) return { o: mr(p, ti, tp, 0, 1), ty: mr(p, ti, tp, 22, 0) };
  if (p < to) return { o: 1, ty: 0 };
  if (p < te) return { o: mr(p, to, te, 1, 0), ty: mr(p, to, te, 0, -12) };
  return { o: 0, ty: -12 };
}

/**
 * Opacità di ogni slide TV — crossfade centrato sui confini tra slide.
 * Ogni transizione è simmetrica: la slide uscente e quella entrante si
 * sovrappongono esattamente a cavallo del boundary, così la somma è ≈1.
 */
function slideOpacity(idx: number, p: number): number {
  const n   = SLIDES.length;
  const dur = TV_RANGE / n;
  const hxf = dur * 0.30; // metà-crossfade (30% del dur su ogni lato del boundary)

  if (p <= TV_START) return idx === 0 ? 1 : 0;
  if (p >= TV_END)   return idx === n - 1 ? 1 : 0;

  const prevB = TV_START + idx * dur;         // confine con slide precedente
  const nextB = TV_START + (idx + 1) * dur;  // confine con slide successiva

  // Fade-in dal boundary precedente (se non è la prima slide)
  if (idx > 0 && p < prevB - hxf) return 0;
  if (idx > 0 && p < prevB + hxf) {
    return mr(p, prevB - hxf, prevB + hxf, 0, 1);
  }

  // Fade-out verso il boundary successivo (se non è l'ultima slide)
  if (idx < n - 1 && p >= nextB + hxf) return 0;
  if (idx < n - 1 && p >= nextB - hxf) {
    return mr(p, nextB - hxf, nextB + hxf, 1, 0);
  }

  return 1; // piena visibilità
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImmersiveBoatJourney() {
  const containerRef  = useRef<HTMLDivElement>(null);

  // Bottone "Scopri di più" — scrolla all'inizio della Phase 1
  const scrollToNext = () => {
    const container = containerRef.current;
    if (!container) return;
    const maxScroll = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.30, behavior: "smooth" });
  };
  const progressRef   = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const imgRefs       = useRef<(HTMLDivElement | null)[]>(PHASES.map(() => null));
  const textRefs      = useRef<(HTMLDivElement | null)[]>(PHASES.map(() => null));
  const slideRefs     = useRef<(HTMLImageElement | null)[]>(SLIDES.map(() => null));

  useEffect(() => {
    // Reduced-motion: mostra solo primo frame
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const el = imgRefs.current[0];
      if (el) { el.style.opacity = "1"; el.style.transform = "scale(1)"; }
      const tx = textRefs.current[0];
      if (tx) { tx.style.opacity = "1"; tx.style.transform = "none"; }
      if (scrollHintRef.current) scrollHintRef.current.style.display = "none";
      return;
    }

    let rafId: number | null = null;

    const animate = () => {
      rafId = null;
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = window.scrollY - container.offsetTop;
      const maxScroll  = container.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, scrollTop / maxScroll));

      // Progress bar
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;

      // Scroll hint
      if (scrollHintRef.current)
        scrollHintRef.current.style.opacity = mr(p, 0, 0.05, 1, 0).toFixed(3);

      // Image layers
      for (let i = 0; i < PHASES.length; i++) {
        const el = imgRefs.current[i];
        if (!el) continue;
        const ph = PHASES[i];
        const o  = imgOpacity(ph, p);
        const s  = imgScale(ph, p);
        const ty = (s - 1) * -28;
        el.style.opacity   = o.toFixed(3);
        el.style.transform = `scale(${s.toFixed(4)}) translateY(${ty.toFixed(1)}px)`;
      }

      // TV slide carousel (Phase 2)
      for (let si = 0; si < SLIDES.length; si++) {
        const el = slideRefs.current[si];
        if (!el) continue;
        el.style.opacity = slideOpacity(si, p).toFixed(3);
      }

      // Text overlays (tutte le fasi inclusa la 2 con pannello descrittivo)
      for (let i = 0; i < PHASES.length; i++) {
        const el = textRefs.current[i];
        if (!el) continue;
        const { o, ty } = textVis(PHASES[i], p);
        el.style.opacity       = o.toFixed(3);
        el.style.transform     = `translateY(${ty.toFixed(1)}px)`;
        el.style.pointerEvents = o > 0.05 ? "auto" : "none";
      }
    };

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    animate();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="bsj-container">
      <div className="bsj-sticky">

        {/* ── Navigazione ────────────────────────────────────── */}
        <header className="nav ibj-nav">
          <a className="nav__brand" href="#top" aria-label="1500 Miglia Festival">
            <img src={whiteLogo} alt="1500 Miglia Festival" />
          </a>
          <nav className="nav__links" aria-label="Navigazione principale">
            <a href="#festival">Il festival</a>
            <a href="#tappe">Le tappe</a>
            <a href="#experience">Experience</a>
            <a href="#crew">Crew</a>
          </nav>
          <div className="nav__social">
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src={socialIG} alt="Instagram" className="nav__social-img" draggable={false} />
            </a>
            <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src={socialFB} alt="Facebook"  className="nav__social-img" draggable={false} />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <img src={socialWA} alt="WhatsApp"  className="nav__social-img" draggable={false} />
            </a>
          </div>
        </header>

        {/* ── Progress bar ────────────────────────────────────── */}
        <div ref={progressRef} className="ibj-progress" aria-hidden="true" />

        {/* ── Vignetta cinematica ─────────────────────────────── */}
        <div className="bsj-vignette" aria-hidden="true" />

        {/* ── Image layers ────────────────────────────────────── */}
        {PHASES.map((ph, i) => (
          <div
            key={`img-${i}`}
            ref={(el) => { imgRefs.current[i] = el; }}
            className="bsj-img-layer"
            style={{ zIndex: i + 1, opacity: i === 0 ? 1 : 0 }}
            aria-hidden="true"
          >
            <img
              src={ph.img}
              alt={ph.alt}
              draggable={false}
              style={i === 2 ? { transform: "scale(1.06)", transformOrigin: "50% 40%" } : undefined}
            />

            {/* TV carousel — solo su Phase 2 (img3) */}
            {i === 2 && (
              <div className="bsj-tv-overlay" aria-hidden="true">
                {SLIDES.map((slide, si) => (
                  <img
                    key={si}
                    ref={(el) => { slideRefs.current[si] = el; }}
                    src={slide}
                    alt={`Slide ${si + 1}`}
                    className="bsj-tv-slide"
                    style={{ opacity: si === 0 ? 1 : 0 }}
                    draggable={false}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* ── Text overlays ───────────────────────────────────── */}

        {/* Phase 0 — Coming Soon (sinistra) */}
        <div className="bsj-text-anchor bsj-text-anchor--left" style={{ zIndex: 30, bottom: "clamp(26vh, 34vh, 20rem)" }}>
          <div
            ref={(el) => { textRefs.current[0] = el; }}
            className="bsj-text"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <p className="bsj-text__label">1500 Miglia Festival</p>
            <h2 className="bsj-text__title">
              <span className="bsj-text__title-line">Coming</span>
              <span className="bsj-text__title-line bsj-text__title-line--cyan">Soon</span>
            </h2>
            <p className="bsj-text__desc">
              Un'esperienza unica tra mare, musica e libertà lungo le coste del Tirreno.
            </p>
            <button className="bsj-scroll-cta" onClick={scrollToNext}>
              Scopri di più
              <span className="bsj-scroll-cta__arrow" aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        {/* Phase 1 — Titolo + stats (sinistra) */}
        <div className="bsj-text-anchor bsj-text-anchor--left" style={{ zIndex: 30, bottom: "clamp(18vh, 24vh, 16rem)" }}>
          <div
            ref={(el) => { textRefs.current[1] = el; }}
            className="bsj-text"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <h2 className="bsj-text__title">
              <span className="bsj-text__title-line">Più tappe.</span>
              <span className="bsj-text__title-line">Più esperienze.</span>
              <span className="bsj-text__title-line bsj-text__title-line--cyan">Un'unica rotta.</span>
            </h2>
            <p className="bsj-text__desc">
              Da località iconiche a baie nascoste. Musica, sport, natura e nuove connessioni.
            </p>
            <div className="bsj-stats" style={{ justifyContent: "flex-start", marginTop: "1.2rem" }}>
              <div className="bsj-stat" style={{ paddingLeft: 0 }}>
                <span className="bsj-stat__num">10</span>
                <span className="bsj-stat__label">Tappe</span>
              </div>
              <div className="bsj-stat__divider" aria-hidden="true" />
              <div className="bsj-stat">
                <span className="bsj-stat__num">6</span>
                <span className="bsj-stat__label">Regioni</span>
              </div>
              <div className="bsj-stat__divider" aria-hidden="true" />
              <div className="bsj-stat">
                <span className="bsj-stat__num">2</span>
                <span className="bsj-stat__label">Mesi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 — descrizione festival (destra, accanto alla TV) */}
        <div className="bsj-text-anchor bsj-text-anchor--right" style={{ zIndex: 30 }}>
          <div
            ref={(el) => { textRefs.current[2] = el; }}
            className="bsj-text bsj-text--tvdesc"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <p className="bsj-text__label">Il Viaggio</p>
            <p className="bsj-text__desc">
              Dal 29 maggio, una flotta di 10 barche a vela salpa per due mesi
              lungo le coste del Tirreno — musica, scienza e cultura in
              10 tappe attraverso 6 regioni.
            </p>
          </div>
        </div>

        {/* Phase 3 — Crew + contatti (sinistra, testo centrato) */}
        <div className="bsj-text-anchor bsj-text-anchor--left" style={{ zIndex: 30, bottom: "clamp(24vh, 30vh, 21rem)" }}>
          <div
            ref={(el) => { textRefs.current[3] = el; }}
            className="bsj-text bsj-text--crew bsj-text--hero"
            style={{ opacity: 0, pointerEvents: "none", textAlign: "center" }}
          >
            <p className="bsj-text__label">Entra nella crew</p>
            <h2 className="bsj-text__title">
              <span className="bsj-text__title-line">Fai parte</span>
              <span className="bsj-text__title-line">dell'avventura</span>
            </h2>
            <p className="bsj-text__desc">
              Festival, musica e cultura lungo le coste del Tirreno.
            </p>
            <div className="bsj-crew">
              <a
                href={`mailto:${contactEmail}?subject=Informazioni%201500%20Miglia%20Festival`}
                className="bsj-text__cta"
              >
                {contactEmail}
              </a>
              <div className="bsj-crew__social">
                <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                  Instagram
                </a>
                <span className="bsj-crew__dot" aria-hidden="true">·</span>
                <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                  Facebook
                </a>
                <span className="bsj-crew__dot" aria-hidden="true">·</span>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ── Scroll hint ─────────────────────────────────────── */}
        <div ref={scrollHintRef} className="ibj-scroll-hint" aria-hidden="true">
          <span>Scorri per entrare</span>
          <div className="ibj-scroll-line">
            <div className="ibj-scroll-dot" />
          </div>
        </div>

      </div>
    </div>
  );
}
