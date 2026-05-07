"use client";

import { useState, useRef } from "react";
import Terminal from "./Terminal";
import { siteConfig } from "@/data/content";

const CHROME = {
  barBg:     "#1E293B",
  barBorder: "#334155",
  termBg:    "#0F172A",
  dim:       "#94A3B8",
} as const;

const ENTER_DURATION_MS = 320;

type ModalState = "open" | "fullscreen" | "minimized" | "closed";
type ShowState  = "hidden" | "entering" | "visible";

interface TerminalModalProps {
  externalCatQueue?: string | null;
  onExternalCatConsumed?: () => void;
  onVisibilityChange?: (visible: boolean) => void;
  onPhotoOpen?: () => void;
  isPhotoOpen?: boolean;
}

export default function TerminalModal({
  externalCatQueue,
  onExternalCatConsumed,
  onVisibilityChange,
  onPhotoOpen,
  isPhotoOpen,
}: TerminalModalProps) {
  const [state, setState]         = useState<ModalState>("open");
  const [showState, setShowState] = useState<ShowState>("visible"); // visible on initial load
  const [cwd, setCwd]             = useState("/");

  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cwdDisplay = cwd === "/" ? "~" : `~${cwd}`;
  const title = `${siteConfig.terminalUser}@${siteConfig.terminalDomain} ${cwdDisplay}`;

  // Called by both the minimize button and the close button
  const hide = (nextState: "minimized" | "closed") => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    setShowState("hidden");
    setState(nextState);
    onVisibilityChange?.(false);
  };

  // Called by the floating button — kicks off the entrance animation
  const reopen = () => {
    onVisibilityChange?.(true);
    setState("open");
    // rAF ensures the terminal div is in the DOM (and painted hidden) before
    // the animation class is applied, giving the browser a proper starting frame.
    requestAnimationFrame(() => {
      setShowState("entering");
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      enterTimerRef.current = setTimeout(
        () => setShowState("visible"),
        ENTER_DURATION_MS,
      );
    });
  };

  const floatingButton = (
    <button
      onClick={reopen}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-[12px] border transition-all duration-200 hover:brightness-110"
      style={{
        background: CHROME.barBg,
        borderColor: CHROME.barBorder,
        color: CHROME.dim,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
      aria-label="Open terminal"
    >
      <span style={{ color: "#22C55E" }}>$</span>
      <span>Terminal</span>
    </button>
  );

  if (state === "closed") {
    return floatingButton;
  }

  const isFullscreen = state === "fullscreen";

  const FS_TRANSITION =
    "top 300ms cubic-bezier(0.22,1,0.36,1), left 300ms cubic-bezier(0.22,1,0.36,1), right 300ms cubic-bezier(0.22,1,0.36,1), bottom 300ms cubic-bezier(0.22,1,0.36,1), border-radius 300ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms cubic-bezier(0.22,1,0.36,1)";

  const wrapperStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: CHROME.termBg,
    border: `1px solid ${CHROME.barBorder}`,
    transition: FS_TRANSITION,
    ...(isFullscreen
      ? { top: "1.5rem", left: "1.5rem", right: "1.5rem", bottom: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }
      : { top: "10vh", left: "50vw", right: "5rem", bottom: "10vh", borderRadius: "0.75rem", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }),
  };

  const animClass =
    showState === "hidden"   ? "terminal-anim-hidden"   :
    showState === "entering" ? "terminal-anim-entering" :
                               "terminal-anim-visible";

  return (
    <>
      {state === "minimized" && floatingButton}

      <div
        className={animClass}
        style={wrapperStyle}
      >
        {/* ── Title bar ── */}
        <div
          className="flex items-center gap-1.5 px-4 py-2.5 border-b shrink-0 select-none"
          style={{ background: CHROME.barBg, borderColor: CHROME.barBorder }}
        >
          <div className="group flex gap-1.5">
            <button
              onClick={() => hide("closed")}
              className="w-3 h-3 rounded-full flex items-center justify-center hover:brightness-110 transition"
              style={{ background: "#FF5F57", boxShadow: "0 0 0 0.5px #E0443E" }}
              aria-label="Close terminal"
            >
              <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none" stroke="#4D0000" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            </button>

            <button
              onClick={() => hide("minimized")}
              className="w-3 h-3 rounded-full flex items-center justify-center hover:brightness-110 transition"
              style={{ background: "#FEBC2E", boxShadow: "0 0 0 0.5px #DEA123" }}
              aria-label="Minimize terminal"
            >
              <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none" stroke="#995700" strokeWidth="2" strokeLinecap="round">
                <line x1="1" y1="6" x2="11" y2="6" />
              </svg>
            </button>

            <button
              onClick={() => setState((s) => (s === "fullscreen" ? "open" : "fullscreen"))}
              className="w-3 h-3 rounded-full flex items-center justify-center hover:brightness-110 transition"
              style={{ background: "#28C840", boxShadow: "0 0 0 0.5px #1AAB29" }}
              aria-label={state === "fullscreen" ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none" stroke="#006500" strokeWidth="1.5">
                <polyline points="8,1 11,1 11,4" /><polyline points="4,11 1,11 1,8" />
              </svg>
            </button>
          </div>

          <span className="ml-2 text-[11px] font-mono truncate" style={{ color: CHROME.dim }}>
            {title}
          </span>
        </div>

        {/* ── Terminal body ── */}
        <div className="flex-1 min-h-0">
          <Terminal
            externalCatQueue={externalCatQueue}
            onExternalCatConsumed={onExternalCatConsumed}
            onCwdChange={setCwd}
            onPhotoOpen={onPhotoOpen}
            isPhotoOpen={isPhotoOpen}
          />
        </div>
      </div>
    </>
  );
}
