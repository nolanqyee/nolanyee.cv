"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/content";

interface PhotoPreviewProps {
  onClose: () => void;
}

export default function PhotoPreview({ onClose }: PhotoPreviewProps) {
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth * 0.25 - 140,
    y: window.innerHeight * 0.5 - 158,
  }));
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onTitleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  return (
    <div
      className="fixed z-[60] flex flex-col overflow-hidden rounded-xl select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: 280,
        boxShadow: "0 24px 64px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.12)",
      }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5 shrink-0 cursor-grab active:cursor-grabbing"
        style={{ background: "#ECECEC", borderBottom: "1px solid rgba(0,0,0,0.10)" }}
        onMouseDown={onTitleMouseDown}
      >
        {/* Red close — no minimize, no fullscreen */}
        <button
          onClick={onClose}
          onMouseDown={(e) => e.stopPropagation()} // don't start drag on button click
          className="w-3 h-3 rounded-full flex items-center justify-center hover:brightness-95 transition flex-shrink-0 group"
          style={{ background: "#FF5F57", boxShadow: "0 0 0 0.5px #E0443E" }}
          aria-label="Close preview"
        >
          <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none" stroke="#4D0000" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>

        <span
          className="flex-1 text-center text-[12px] font-medium"
          style={{ color: "#3C3C3C", marginRight: "12px" /* optical balance with close btn */ }}
        >
          drag this window around!
        </span>
      </div>

      {/* ── Image ── */}
      <div style={{ background: "#1A1A1A" }}>
        <Image
          src="/images/profile.jpg"
          alt={siteConfig.name}
          width={280}
          height={280}
          className="object-cover block"
          draggable={false}
        />
      </div>
    </div>
  );
}
