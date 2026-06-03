/**
 * ImmersiveBoatJourney — 6 fasi
 *
 *  0  img6  Chi Siamo — I Tirenauti
 *  1  img1  Coming Soon
 *  2  img2  10 tappe / 6 regioni / 2 mesi
 *  3  img3  Carosello slide dentro lo schermo TV
 *  4  img4  Entra nella crew + contatti
 *  5  img5  Partner & Sponsor (underwater)
 *
 * Pure RAF + scroll — zero dipendenze esterne.
 */

import { useEffect, useRef, useState } from "react";
import whiteLogo     from "../assets/logos/slide1-white-logo.png";
import logoMark      from "../assets/logos/tirrenauti-mark.png";
import logoTirenauti from "../assets/logos/LogoTirenauti.png";
import logoWordmark  from "../assets/logos/1500-miglia-festival-logo.png";
import socialIG  from "../assets/social/social-instagram.png";
import socialFB  from "../assets/social/social-facebook.png";
import socialWA  from "../assets/social/social-whatsapp.png";
import img1 from "../assets/backgrounds/immagine1.png";
import img2 from "../assets/backgrounds/immagine2.png";
import img6 from "../assets/backgrounds/immagine6.png";
import img3 from "../assets/backgrounds/immagine3.png";
import img4 from "../assets/backgrounds/immagine4.png";
import img5 from "../assets/backgrounds/immagine5.png";
import slide1 from "../assets/slides/slide1.png";
import slide2 from "../assets/slides/slide2.png";
import slide3 from "../assets/slides/slide3.png";
import slide4 from "../assets/slides/slide4.png";
import slide5 from "../assets/slides/slide5.png";
import slide6 from "../assets/slides/slide6.png";

const SLIDES = [slide1, slide2, slide3, slide4, slide5, slide6];

// ─── Sponsor logos ────────────────────────────────────────────────────────────
// Media Partners (3)
import spM1 from "../assets/sponsors/mediapartner1.png";
import spM2 from "../assets/sponsors/mediapartner2.png";
import spM3 from "../assets/sponsors/mediapartner3.png";
// Partners Tecnici (12)
import spT1  from "../assets/sponsors/sponsor-10.png";
import spT2  from "../assets/sponsors/sponsor-11.png";
import spT3  from "../assets/sponsors/sponsor-12.png";
import spT4  from "../assets/sponsors/sponsor-13.png";
import spT5  from "../assets/sponsors/sponsor-15.png";
import spT6  from "../assets/sponsors/sponsor-16.png";
import spT7  from "../assets/sponsors/sponsor-17.jpeg";
import spT8  from "../assets/sponsors/sponsor-18.png";
import spT9  from "../assets/sponsors/sponsor-19.png";
import spT10 from "../assets/sponsors/sponsor-20.png";
import spT11 from "../assets/sponsors/sponsor-21.png";
import spT12 from "../assets/sponsors/sponsor-22.png";
// Patrocinato da (7)
import spP1 from "../assets/sponsors/patrocinio1.png";
import spP2 from "../assets/sponsors/patrocinio2.png";
import spP3 from "../assets/sponsors/patrocinio3.png";
import spP4 from "../assets/sponsors/patrocinio4.png";
import spP5 from "../assets/sponsors/patrocinio5.png";
import spP6 from "../assets/sponsors/patrocinio6.png";
import spP7 from "../assets/sponsors/patrocinio7.png";

// TODO: aggiornare gli url con i siti ufficiali
const MEDIA_PARTNERS = [
  { logo: spM1, name: "Media Partner 1", url: "#" },
  { logo: spM2, name: "Media Partner 2", url: "#" },
  { logo: spM3, name: "Media Partner 3", url: "#" },
];
const TECNICI_PARTNERS = [
  { logo: spT1,  name: "Partner Tecnico 1",  url: "#" },
  { logo: spT2,  name: "Partner Tecnico 2",  url: "#" },
  { logo: spT3,  name: "Partner Tecnico 3",  url: "#" },
  { logo: spT4,  name: "Partner Tecnico 4",  url: "#" },
  { logo: spT5,  name: "Partner Tecnico 5",  url: "#" },
  { logo: spT6,  name: "Partner Tecnico 6",  url: "#" },
  { logo: spT7,  name: "Partner Tecnico 7",  url: "#" },
  { logo: spT8,  name: "Partner Tecnico 8",  url: "#" },
  { logo: spT9,  name: "Partner Tecnico 9",  url: "#" },
  { logo: spT10, name: "Partner Tecnico 10", url: "#" },
  { logo: spT11, name: "Partner Tecnico 11", url: "#" },
  { logo: spT12, name: "Partner Tecnico 12", url: "#" },
];
const PATROCINI = [
  { logo: spP1, name: "Patrocinio 1", url: "#" },
  { logo: spP2, name: "Patrocinio 2", url: "#" },
  { logo: spP3, name: "Patrocinio 3", url: "#" },
  { logo: spP4, name: "Patrocinio 4", url: "#" },
  { logo: spP5, name: "Patrocinio 5", url: "#" },
  { logo: spP6, name: "Patrocinio 6", url: "#" },
  { logo: spP7, name: "Patrocinio 7", url: "#" },
];

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
  // ── 0  Chi Siamo — I Tirenauti ───────────────────────────────────────────
  {
    img: img6, alt: "La crew dei Tirenauti in navigazione al tramonto",
    fadeIn:   [-0.01, 0.00],
    peak:     [0.00,  0.12],
    fadeOut:  [0.12,  0.17],
    scaleIn: 1.00, scalePeak: 1.04, scaleOut: 1.07,
  },
  // ── 1  Coming Soon ────────────────────────────────────────────────────────
  {
    img: img1, alt: "Barca a vela al tramonto sul Tirreno",
    fadeIn:   [0.12,  0.17],
    peak:     [0.17,  0.30],
    fadeOut:  [0.30,  0.35],
    scaleIn: 1.00, scalePeak: 1.05, scaleOut: 1.08,
  },
  // ── 2  Le cifre ────────────────────────────────────────────────────────────
  {
    img: img2, alt: "Vista dal ponte della barca al tramonto",
    fadeIn:   [0.30,  0.35],
    peak:     [0.35,  0.49],
    fadeOut:  [0.49,  0.54],
    scaleIn: 1.06, scalePeak: 1.10, scaleOut: 1.13,
  },
  // ── 3  Salotto (TV carousel) ───────────────────────────────────────────────
  {
    img: img3, alt: "Interno lussuoso della barca — salotto con TV",
    fadeIn:   [0.49,  0.54],
    peak:     [0.54,  0.66],
    fadeOut:  [0.66,  0.71],
    scaleIn: 1.11, scalePeak: 1.14, scaleOut: 1.11,
  },
  // ── 4  Crew + contatti ────────────────────────────────────────────────────
  {
    img: img4, alt: "Barca con vela colorata in navigazione al tramonto",
    fadeIn:   [0.66,  0.71],
    peak:     [0.71,  0.84],
    fadeOut:  [0.84,  0.89],
    scaleIn: 1.10, scalePeak: 1.06, scaleOut: 1.06,
  },
  // ── 5  Partner & Sponsor (underwater) ────────────────────────────────────
  {
    img: img5, alt: "Vista subacquea del Mediterraneo al tramonto",
    fadeIn:   [0.84,  0.89],
    peak:     [0.89,  1.00],
    fadeOut:  [9.0,   9.0], // mai sbiadisce
    scaleIn: 1.02, scalePeak: 1.05, scaleOut: 1.05,
  },
];

// TV carousel range (dentro il peak di Phase 3)
const TV_START = PHASES[3].peak[0]; // 0.54
const TV_END   = PHASES[3].fadeOut[0]; // 0.66
const TV_RANGE = TV_END - TV_START;   // 0.12

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
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Bottone "Scopri di più" — scrolla all'inizio della Phase 1
  const scrollToNext = () => {
    const container = containerRef.current;
    if (!container) return;
    const maxScroll = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.30, behavior: "smooth" });
  };
  const progressRef   = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const logoRef       = useRef<HTMLDivElement>(null);
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

      // Logo Chi Siamo — stessa visibilità del textRef[0]
      if (logoRef.current) {
        const { o, ty } = textVis(PHASES[0], p);
        logoRef.current.style.opacity       = o.toFixed(3);
        logoRef.current.style.transform     = `translateY(${ty.toFixed(1)}px)`;
        logoRef.current.style.pointerEvents = o > 0.05 ? "auto" : "none";
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
              style={
              i === 3 ? { transform: "scale(1.06)", transformOrigin: "50% 40%" } :
              i === 5 ? { transform: "scale(1.16)", transformOrigin: "48% 42%" } :
              undefined
            }
            />

            {/* TV carousel — solo su Phase 3 (img3) */}
            {i === 3 && (
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

        {/* Phase 0 — Chi Siamo / I Tirenauti (sinistra) */}
        <div className="bsj-text-anchor bsj-text-anchor--left" style={{ zIndex: 30, top: "clamp(8rem, 22vh, 16rem)", bottom: "auto" }}>
          <div
            ref={(el) => { textRefs.current[0] = el; }}
            className="bsj-text"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <p className="bsj-text__label">I Tirenauti</p>
            <h2 className="bsj-text__title">
              <span className="bsj-text__title-line">Un popolo</span>
              <span className="bsj-text__title-line bsj-text__title-line--cyan">del mare</span>
            </h2>
            <p className="bsj-text__desc">
              Un popolo immaginario che esiste solo nel movimento e nello scambio
              di idee. Discendenti di Ulisse, portano storie, musica e sapori da
              porto in porto — non spettacoli, ma incontri generativi di arte,
              scienza e cucina.
            </p>
            <div className="bsj-stats" style={{ justifyContent: "flex-start", marginTop: "1.2rem" }}>
              <div className="bsj-stat" style={{ paddingLeft: 0 }}>
                <span className="bsj-stat__num">40</span>
                <span className="bsj-stat__label">Tirenauti</span>
              </div>
              <div className="bsj-stat__divider" aria-hidden="true" />
              <div className="bsj-stat">
                <span className="bsj-stat__num">10</span>
                <span className="bsj-stat__label">Barche</span>
              </div>
            </div>
            <button className="bsj-scroll-cta" onClick={scrollToNext}>
              Scopri di più
              <span className="bsj-scroll-cta__arrow" aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        {/* Phase 0 — Logo Tirenauti (destra, centrato verticalmente) */}
        <div className="chiSiamo-logo-wrap">
          <div
            ref={logoRef}
            style={{ opacity: 0, pointerEvents: "none", willChange: "opacity, transform" }}
          >
            <img
              src={logoTirenauti}
              alt="Logo Tirenauti"
              draggable={false}
              style={{
                width: "clamp(14rem, 26vw, 22rem)",
                height: "auto",
                filter: "drop-shadow(0 0 3rem rgba(255,255,255,0.15)) drop-shadow(0 0 1.2rem rgba(32,200,255,0.22))",
              }}
            />
          </div>
        </div>

        {/* Phase 1 — Coming Soon (sinistra) */}
        <div className="bsj-text-anchor bsj-text-anchor--left" style={{ zIndex: 30, bottom: "clamp(26vh, 34vh, 20rem)" }}>
          <div
            ref={(el) => { textRefs.current[1] = el; }}
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
          </div>
        </div>

        {/* Phase 2 — Titolo + stats (sinistra) */}
        <div className="bsj-text-anchor bsj-text-anchor--left" style={{ zIndex: 30, bottom: "clamp(18vh, 24vh, 16rem)" }}>
          <div
            ref={(el) => { textRefs.current[2] = el; }}
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

        {/* Phase 3 — descrizione festival (destra, accanto alla TV) */}
        <div className="bsj-text-anchor bsj-text-anchor--right" style={{ zIndex: 30 }}>
          <div
            ref={(el) => { textRefs.current[3] = el; }}
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

        {/* Phase 4 — Crew + contatti (sinistra, testo centrato) */}
        <div className="bsj-text-anchor bsj-text-anchor--left" style={{ zIndex: 30, bottom: "clamp(24vh, 30vh, 21rem)" }}>
          <div
            ref={(el) => { textRefs.current[4] = el; }}
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

        {/* Phase 5 — Partner & Sponsor (centro, 3 sezioni) */}
        <div
          className="bsj-text-anchor bsj-text-anchor--center"
          style={{ zIndex: 30, top: "50%", bottom: "auto", transform: "translate(-50%, -50%)", maxWidth: "min(94vw, 70rem)" }}
        >
          <div
            ref={(el) => { textRefs.current[5] = el; }}
            className="bsj-text bsj-text--sponsors"
            style={{ opacity: 0, pointerEvents: "none", textAlign: "center" }}
          >

            {/* ── Media Partners ─────────────────────── */}
            <div className="bsj-spcat">
              <p className="bsj-spcat__label">Media Partners Serie TV</p>
              <div className="bsj-spcat__row">
                {MEDIA_PARTNERS.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    className="bsj-sp-tile bsj-sp-tile--lg" aria-label={s.name}>
                    <img src={s.logo} alt={s.name} className="bsj-sp-logo bsj-sp-logo--lg" draggable={false} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Partners Tecnici — ticker ───────────── */}
            <div className="bsj-spcat">
              <p className="bsj-spcat__label">Partners Tecnici</p>
              <div className="bsj-ticker-wrap">
                <div className="bsj-ticker-track">
                  {[...TECNICI_PARTNERS, ...TECNICI_PARTNERS].map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer"
                      className="bsj-sp-tile" aria-label={s.name}>
                      <img src={s.logo} alt={s.name} className="bsj-sp-logo" draggable={false} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Patrocinato da ─────────────────────── */}
            <div className="bsj-spcat">
              <p className="bsj-spcat__label">Patrocinato da</p>
              <div className="bsj-spcat__row bsj-spcat__row--wrap">
                {PATROCINI.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    className="bsj-sp-tile" aria-label={s.name}>
                    <img src={s.logo} alt={s.name} className="bsj-sp-logo" draggable={false} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="bsj-footer">
          <span>© {new Date().getFullYear()} 1500 Miglia Festival. Tutti i diritti riservati.</span>
          <span className="bsj-footer__sep" aria-hidden="true">·</span>
          <button className="bsj-footer__link" onClick={() => setShowPrivacy(true)}>
            Privacy Policy
          </button>
        </footer>

        {/* ── Privacy Policy Modal ─────────────────────────────── */}
        {showPrivacy && (
          <div className="bsj-modal-overlay" onClick={() => setShowPrivacy(false)} role="dialog" aria-modal="true" aria-label="Privacy Policy">
            <div className="bsj-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bsj-modal__header">
                <h2 className="bsj-modal__title">Privacy Policy</h2>
                <button className="bsj-modal__close" onClick={() => setShowPrivacy(false)} aria-label="Chiudi">✕</button>
              </div>
              <div className="bsj-modal__body">
                <p className="bsj-modal__update">Ultimo aggiornamento: maggio 2025</p>

                <h3>Titolare del trattamento</h3>
                <p>
                  Il presente sito web è gestito da <strong>1500 Miglia Festival</strong>.<br />
                  Per qualsiasi richiesta relativa ai tuoi dati personali puoi scrivere a:{" "}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </p>

                <h3>Dati raccolti</h3>
                <p>
                  Navigando questo sito, i server registrano automaticamente alcune informazioni
                  tecniche (indirizzo IP, tipo di browser, sistema operativo, pagine visitate e
                  orario di accesso) a fini di sicurezza e per garantire il corretto funzionamento
                  del servizio. Non vengono raccolti dati personali tramite form, account o cookie
                  di profilazione.
                </p>

                <h3>Cookie</h3>
                <p>
                  Questo sito <strong>non utilizza cookie di profilazione o tracciamento</strong>.
                  Possono essere presenti esclusivamente cookie tecnici strettamente necessari al
                  funzionamento della pagina (es. preferenze di navigazione salvate localmente nel
                  browser). Nessun dato viene trasmesso a terze parti a scopo pubblicitario.
                </p>

                <h3>Base giuridica e finalità</h3>
                <p>
                  I dati tecnici di navigazione vengono trattati sulla base del legittimo interesse
                  del titolare (art. 6, par. 1, lett. f del GDPR) al solo fine di garantire la
                  sicurezza e il corretto funzionamento del sito.
                </p>

                <h3>Conservazione dei dati</h3>
                <p>
                  I log tecnici vengono conservati per il tempo strettamente necessario alle
                  finalità sopra indicate e comunque non oltre 12 mesi.
                </p>

                <h3>Diritti degli utenti</h3>
                <p>
                  Ai sensi degli artt. 15–22 del GDPR hai diritto di accedere ai tuoi dati,
                  richiederne la rettifica o la cancellazione, opporti al trattamento e proporre
                  reclamo all'autorità di controllo (Garante per la protezione dei dati personali –{" "}
                  <a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">www.garanteprivacy.it</a>).
                  Per esercitare tali diritti scrivi a:{" "}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </p>

                <p className="bsj-modal__disclaimer">
                  Questa informativa è da intendersi come documento placeholder. Si raccomanda di
                  farla revisionare da un professionista legale prima della pubblicazione ufficiale
                  del sito.
                </p>
              </div>
            </div>
          </div>
        )}

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
