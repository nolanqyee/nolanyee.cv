"use client";

import { useState, useCallback } from "react";
import Portfolio from "@/components/Portfolio/Portfolio";
import TerminalModal from "@/components/Terminal/TerminalModal";
import PhotoPreview from "@/components/PhotoPreview";

export default function Home() {
  const [catQueue, setCatQueue] = useState<string | null>(null);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [showPhoto, setShowPhoto] = useState(false);

  const handleVisibilityChange = useCallback((visible: boolean) => {
    setTerminalVisible(visible);
  }, []);

  return (
    <main
      className="min-h-screen"
      style={{ background: "#F7F6F3" }}
    >
      {/* Portfolio — transitions between left-half and full-width centered */}
      <div
        className="transition-[width] duration-300 ease-in-out"
        style={{ width: terminalVisible ? "50vw" : "100%" }}
      >
        <Portfolio onCat={(path) => setCatQueue(path)} />
      </div>

      {/* Terminal — fixed overlay on the right half */}
      <div className="fixed left-[50vw] top-[10vh] right-20 bottom-[10vh]">
        <TerminalModal
          externalCatQueue={catQueue}
          onExternalCatConsumed={() => setCatQueue(null)}
          onVisibilityChange={handleVisibilityChange}
          onPhotoOpen={() => setShowPhoto(true)}
          isPhotoOpen={showPhoto}
        />
      </div>

      {/* Draggable photo preview window */}
      {showPhoto && <PhotoPreview onClose={() => setShowPhoto(false)} />}
    </main>
  );
}
