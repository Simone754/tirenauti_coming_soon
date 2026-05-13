import { startTransition, useEffect, useState } from "react";
import heroImage from "../assets/hero-sailboat-sunset.png";
import whiteLogo from "../ppt_refs/slide1-white-logo.png";
import slide1 from "../slide1.png";
import slide2 from "../slide2.png";
import slide3 from "../slide3.png";
import slide4 from "../slide4.png";
import slide5 from "../slide5.png";
import slide6 from "../slide6.png";

const socialUrl = "https://www.instagram.com/dilettaleotta/";
const contactEmail = "info@1500miglia.com";

const highlights = [
  { value: "10", label: "tappe" },
  { value: "6", label: "regioni" },
  { value: "2", label: "mesi" },
] as const;

const slides = [
  {
    image: slide1,
    alt: "Identita visiva del 1500 Miglia Festival.",
    title: "Il festival prende forma",
    description:
      "Un sistema visivo pensato per raccontare mare, territorio e movimento.",
  },
  {
    image: slide2,
    alt: "Barca a vela nel blu del Tirreno vista dall'alto.",
    title: "Rotte sul Tirreno",
    description:
      "La navigazione diventa il filo conduttore tra luoghi, persone e contenuti.",
  },
  {
    image: slide3,
    alt: "Flotta di barche a vela tra scogliere e mare aperto.",
    title: "La flotta",
    description:
      "Un viaggio condiviso, costruito attorno alla costa e alle sue comunita.",
  },
  {
    image: slide4,
    alt: "Piazza sul mare con palco e pubblico del festival.",
    title: "Le tappe a terra",
    description:
      "Ogni approdo diventa uno spazio vivo tra musica, racconto e incontri.",
  },
  {
    image: slide5,
    alt: "Palco del festival con luci e scenografia.",
    title: "Experience",
    description:
      "Concerti, ospiti e momenti pensati per vivere il festival da vicino.",
  },
  {
    image: slide6,
    alt: "Slide testuale sul senso del viaggio culturale del festival.",
    title: "Un'unica rotta",
    description:
      "Un progetto itinerante che mette insieme mare, cultura e nuove connessioni.",
  },
] as const;

const socialLinks = [
  { label: "Instagram", shortLabel: "IG" },
  { label: "TikTok", shortLabel: "TK" },
  { label: "WhatsApp", shortLabel: "WA" },
] as const;

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const activeSlide = slides[currentSlide];

  const goToSlide = (index: number) => {
    startTransition(() => {
      setCurrentSlide(index);
    });
  };

  const showPrevious = () => {
    startTransition(() => {
      setCurrentSlide((current) =>
        current === 0 ? slides.length - 1 : current - 1,
      );
    });
  };

  const showNext = () => {
    startTransition(() => {
      setCurrentSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1,
      );
    });
  };

  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="hero-title">
        <img
          alt=""
          aria-hidden="true"
          className="hero__image"
          src={heroImage}
        />
        <div className="hero__shade" />

        <header className="nav">
          <a className="nav__brand" href="#top" aria-label="Tirrenauti Festival">
            <img src={whiteLogo} alt="Tirrenauti Festival" />
          </a>

          <nav className="nav__links" aria-label="Navigazione principale">
            <a href="#festival">Il festival</a>
            <a href="#tappe">Le tappe</a>
            <a href="#experience">Experience</a>
            <a href="#crew">Crew</a>
          </nav>

          <div className="nav__social" aria-label="Canali social">
            {socialLinks.slice(0, 2).map((social) => (
              <a
                href={socialUrl}
                key={social.label}
                rel="noreferrer"
                target="_blank"
                aria-label={social.label}
              >
                {social.shortLabel}
              </a>
            ))}
          </div>
        </header>

        <div
          id="top"
          className={[
            "hero__content",
            isReady ? "is-visible" : "is-hidden",
          ].join(" ")}
        >
          <p className="hero__eyebrow">Tirrenauti Festival</p>
          <h1 id="hero-title">
            Coming
            <span>Soon</span>
          </h1>
          <p className="hero__copy">
            Un'esperienza tra mare, musica e liberta.
          </p>
          <a className="hero__cta" href="#festival">
            Scopri di piu
            <span aria-hidden="true">v</span>
          </a>
        </div>
      </section>

      <section className="stats" aria-label="Numeri del festival">
        {highlights.map((item) => (
          <div className="stats__item" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="intro" id="festival">
        <div className="intro__copy">
          <span className="wave-mark" aria-hidden="true">
            ~~~
          </span>
          <h2>
            Piu tappe.
            <br />
            Piu esperienze.
            <span>Un'unica rotta.</span>
          </h2>
          <p>
            Da localita iconiche a baie nascoste. Musica, sport, natura e nuove
            connessioni: tutto questo e Tirrenauti Festival.
          </p>
          <span className="anchor-mark" aria-hidden="true">
            |
          </span>
        </div>

        <section
          className="route-gallery"
          id="experience"
          aria-label="Carosello del festival"
        >
          <div className="route-gallery__stage">
            <button
              className="gallery-arrow gallery-arrow--left"
              type="button"
              onClick={showPrevious}
              aria-label="Slide precedente"
            >
              &lsaquo;
            </button>
            <img key={activeSlide.title} src={activeSlide.image} alt={activeSlide.alt} />
            <button
              className="gallery-arrow gallery-arrow--right"
              type="button"
              onClick={showNext}
              aria-label="Slide successiva"
            >
              &rsaquo;
            </button>
          </div>

          <div className="route-gallery__meta">
            <p>{activeSlide.title}</p>
            <span>{activeSlide.description}</span>
          </div>

          <div className="route-gallery__dots" aria-label="Scegli una slide">
            {slides.map((slide, index) => (
              <button
                aria-label={`Vai alla slide ${index + 1}: ${slide.title}`}
                className={index === currentSlide ? "is-active" : ""}
                key={slide.title}
                onClick={() => goToSlide(index)}
                type="button"
              />
            ))}
          </div>
        </section>
      </section>

      <section className="contact" id="crew" aria-labelledby="contact-title">
        <p className="contact__eyebrow" id="tappe">
          Le tappe saranno annunciate presto
        </p>
        <h2 id="contact-title">Entra nella crew</h2>
        <p>
          Per collaborazioni, informazioni o per salire a bordo del progetto,
          scrivici direttamente.
        </p>
        <a
          className="contact__mail"
          href={`mailto:${contactEmail}?subject=Informazioni%201500%20Miglia%20Festival`}
        >
          {contactEmail}
        </a>

        <div className="contact__social" aria-label="Pulsanti social di test">
          {socialLinks.map((social) => (
            <a
              href={socialUrl}
              key={social.label}
              rel="noreferrer"
              target="_blank"
              aria-label={`${social.label} - link provvisorio`}
            >
              {social.shortLabel}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
