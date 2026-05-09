"use client";

import { useState, useCallback, useEffect } from "react";
import Portfolio from "@/components/Portfolio/Portfolio";
import TerminalModal from "@/components/Terminal/TerminalModal";
import PhotoPreview from "@/components/PhotoPreview";

export default function Home() {
  const [catQueue, setCatQueue] = useState<string | null>(null);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [showPhoto, setShowPhoto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleVisibilityChange = useCallback((visible: boolean) => {
    setTerminalVisible(visible);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "#F7F6F3" }}>
      {/* Portfolio — always full width on mobile (CSS), desktop toggles with JS */}
      <div
        className={`transition-[width] duration-300 ease-in-out w-full ${terminalVisible ? "md:w-[50vw]" : "md:w-full"}`}
      >
        <Portfolio onCat={(path) => setCatQueue(path)} />
      </div>

      <TerminalModal
        externalCatQueue={catQueue}
        onExternalCatConsumed={() => setCatQueue(null)}
        onVisibilityChange={handleVisibilityChange}
        onPhotoOpen={() => setShowPhoto(true)}
        isPhotoOpen={showPhoto}
        isMobile={isMobile}
      />

      {showPhoto && <PhotoPreview onClose={() => setShowPhoto(false)} />}
    </main>
  );
}
