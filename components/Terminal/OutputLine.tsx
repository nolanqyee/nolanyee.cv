"use client";

// Terminal dark palette — hardcoded, no theme switching
const T = {
  text:   "#E2E8F0",
  dim:    "#94A3B8",
  accent: "#60A5FA",
  error:  "#F87171",
} as const;

export type OutputEntry =
  | { type: "input"; text: string }
  | { type: "text"; text: string }
  | { type: "error"; text: string }
  | { type: "markdown"; html: string }
  | { type: "visual"; html: string; visualProps: unknown };

function TextWithLinks({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer"
            style={{ color: T.accent, textDecoration: "underline" }}>
            {part}
          </a>
        ) : part
      )}
    </>
  );
}

interface OutputLineProps {
  entry: OutputEntry;
}

export default function OutputLine({ entry }: OutputLineProps) {
  if (entry.type === "input") {
    return (
      // COMMAND_SPACING: match mt value to Terminal.tsx inline prompt mt
      <div className="flex gap-2 items-baseline mt-[18px] first:mt-0">
        <span className="select-none shrink-0" style={{ color: "#22C55E" }}>$</span>
        <span style={{ color: T.text }}>{entry.text}</span>
      </div>
    );
  }

  if (entry.type === "error") {
    return (
      <p className="whitespace-pre-wrap leading-normal pl-0.5 mt-1" style={{ color: T.error }}>
        {entry.text}
      </p>
    );
  }

  if (entry.type === "markdown") {
    return (
      <div
        className="leading-normal pl-0.5 mt-1 [&_strong]:font-semibold [&_em]:italic [&_br]:block [&_br]:content-[''] [&_br]:mt-0"
        style={{ color: T.dim }}
        dangerouslySetInnerHTML={{ __html: entry.html }}
      />
    );
  }

  if (entry.type === "visual") {
    return (
      <div className="space-y-1.5 pl-0.5 mt-1">
        <div
          className="leading-normal [&_strong]:font-semibold [&_br]:block [&_br]:content-[''] [&_br]:mt-0"
          style={{ color: T.dim }}
          dangerouslySetInnerHTML={{ __html: entry.html }}
        />
        <div className="border rounded px-2 py-1.5 text-[11px] italic"
          style={{ borderColor: "#334155", color: T.dim }}>
          [visual card — Phase 3]
        </div>
      </div>
    );
  }

  return (
    <p className="whitespace-pre-wrap leading-normal pl-0.5 mt-1" style={{ color: T.dim }}>
      <TextWithLinks text={entry.text} />
    </p>
  );
}
