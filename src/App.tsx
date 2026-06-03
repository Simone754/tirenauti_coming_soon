import { useEffect, useRef, useState } from "react";
import ImmersiveBoatJourney from "./components/ImmersiveBoatJourney";

export default function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Se l'utente ha già visto l'intro in questa sessione, la saltiamo
  useEffect(() => {
    if (sessionStorage.getItem("introPlayed")) {
      setIntroVisible(false);
    }
  }, []);

  const dismissIntro = () => {
    if (fadingOut) return;
    setFadingOut(true);
    sessionStorage.setItem("introPlayed", "1");
    setTimeout(() => setIntroVisible(false), 800);
  };

  const handleVideoEnd = () => {
    dismissIntro();
  };

  if (!introVisible) {
    return (
      <main className="site-shell">
        <ImmersiveBoatJourney />
      </main>
    );
  }

  return (
    <>
      {/* ── Intro overlay ───────────────────────────────── */}
      <div
        className={["intro-overlay", fadingOut ? "intro-overlay--fading" : ""].join(" ").trim()}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src="/intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="intro-overlay__video"
        />
        <button
          className="intro-overlay__skip"
          onClick={dismissIntro}
          aria-label="Salta intro"
        >
          Salta intro ›
        </button>
      </div>

      {/* ── Sito (precaricato sotto) ─────────────────────── */}
      <main className="site-shell" aria-hidden={introVisible}>
        <ImmersiveBoatJourney />
      </main>
    </>
  );
}
