"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import OutputLine, { OutputEntry } from "./OutputLine";
import { runCommand, getCompletions } from "@/lib/terminal";

function terminalMarkdown(md: string): string {
    return md
        .replace(/^#{1,3} (.+)$/gm, "<strong>$1</strong>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, '<code style="color:#60A5FA">$1</code>')
        .replace(/^- (.+)$/gm, "→ $1")
        .replace(
            /(https?:\/\/[^\s<]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#60A5FA;text-decoration:underline">$1</a>',
        )
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");
}

const WELCOME_CMD = "cat /welcome.md";
const LINE_DELAY_MS = 22;
const SINGLE_LINE_CHUNK_SIZE = 1;

type StreamKind = "text" | "markdown" | "visual";

interface TerminalProps {
    externalCatQueue?: string | null;
    onExternalCatConsumed?: () => void;
    onCwdChange?: (cwd: string) => void;
    onPhotoOpen?: () => void;
    isPhotoOpen?: boolean;
}

export default function Terminal({
    externalCatQueue,
    onExternalCatConsumed,
    onCwdChange,
    onPhotoOpen,
    isPhotoOpen,
}: TerminalProps) {
    const [entries, setEntries] = useState<OutputEntry[]>([]);
    const [input, setInput] = useState("");
    const [cwd, setCwd] = useState("/");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);

    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const streamingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (outputRef.current) {
                outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
        });
    };

    const pushEntry = useCallback((entry: OutputEntry) => {
        setEntries((prev) => [...prev, entry]);
    }, []);

    const updateCwd = useCallback(
        (newCwd: string) => {
            setCwd(newCwd);
            onCwdChange?.(newCwd);
        },
        [onCwdChange],
    );

    const stopStreaming = useCallback(() => {
        if (streamingRef.current !== null) {
            clearTimeout(streamingRef.current);
            streamingRef.current = null;
        }
    }, []);

    const streamOutput = useCallback(
        (kind: StreamKind, content: string, visualProps?: unknown) => {
            stopStreaming();

            const separator = kind === "text" ? "\n" : "<br>";
            const chunks = content.split(separator);
            const streamChunks =
                chunks.length > 1
                    ? chunks
                    : content.length > SINGLE_LINE_CHUNK_SIZE
                      ? Array.from(content)
                      : [content];

            const makeEntry = (value: string): OutputEntry => {
                if (kind === "text") {
                    return { type: "text", text: value };
                }

                if (kind === "visual") {
                    return { type: "visual", html: value, visualProps };
                }

                return { type: "markdown", html: value };
            };

            if (streamChunks.length <= 1) {
                setEntries((prev) => [...prev, makeEntry(content)]);
                scrollToBottom();
                return;
            }

            let i = 0;
            setEntries((prev) => [...prev, makeEntry(streamChunks[0])]);
            scrollToBottom();

            const tick = () => {
                i++;

                if (i >= streamChunks.length) {
                    setEntries((prev) => {
                        const copy = [...prev];
                        const last = copy.length - 1;
                        if (last >= 0) {
                            copy[last] = makeEntry(content);
                        }
                        return copy;
                    });
                    scrollToBottom();
                    streamingRef.current = null;
                    return;
                }

                setEntries((prev) => {
                    const copy = [...prev];
                    const last = copy.length - 1;
                    if (last >= 0) {
                        copy[last] = makeEntry(
                            streamChunks.slice(0, i + 1).join(separator),
                        );
                    }
                    return copy;
                });
                scrollToBottom();
                streamingRef.current = setTimeout(tick, LINE_DELAY_MS);
            };

            streamingRef.current = setTimeout(tick, LINE_DELAY_MS);
        },
        [stopStreaming],
    );

    const handleClear = useCallback(() => {
        stopStreaming();
        setEntries([]);
        const r = runCommand(WELCOME_CMD, "/");
        if (r.kind === "markdown") {
            // Defer so the clear render commits before we start filling again
            setTimeout(() => {
                setEntries([{ type: "input", text: WELCOME_CMD }]);
                streamOutput("markdown", terminalMarkdown(r.body));
            }, 0);
        }
    }, [stopStreaming, streamOutput]);

    const executeCommand = useCallback(
        (cmd: string, showInput = true) => {
            if (showInput && cmd.trim()) {
                pushEntry({ type: "input", text: cmd });
            }

            const result = runCommand(cmd, cwd);
            const isCat = cmd.trim().startsWith("cat ");

            switch (result.kind) {
                case "clear":
                    handleClear();
                    return; // handleClear owns scroll
                case "text":
                    if (isCat && result.text) {
                        streamOutput("text", result.text);
                        return;
                    }
                    if (result.text)
                        pushEntry({ type: "text", text: result.text });
                    break;
                case "error":
                    pushEntry({ type: "error", text: result.text });
                    break;
                case "markdown":
                    if (isCat) {
                        streamOutput("markdown", terminalMarkdown(result.body));
                        return;
                    }
                    pushEntry({
                        type: "markdown",
                        html: terminalMarkdown(result.body),
                    });
                    break;
                case "visual":
                    if (isCat) {
                        streamOutput(
                            "visual",
                            terminalMarkdown(result.body),
                            result.visualProps,
                        );
                        return;
                    }
                    pushEntry({
                        type: "visual",
                        html: terminalMarkdown(result.body),
                        visualProps: result.visualProps,
                    });
                    break;
                case "open":
                    pushEntry({ type: "text", text: result.text });
                    window.open(result.url, "_blank", "noopener,noreferrer");
                    break;
                case "cwd_change":
                    updateCwd(result.newCwd);
                    break;
                case "open_photo":
                    if (isPhotoOpen) {
                        pushEntry({ type: "text", text: "Photo preview is already open." });
                    } else {
                        pushEntry({ type: "text", text: "Opening photo preview..." });
                        onPhotoOpen?.();
                    }
                    break;
            }

            scrollToBottom();
        },
        [cwd, pushEntry, updateCwd, handleClear, streamOutput, onPhotoOpen, isPhotoOpen],
    );

    // Run welcome on mount
    useEffect(() => {
        const r = runCommand(WELCOME_CMD, "/");
        if (r.kind === "markdown") {
            setEntries([{ type: "input", text: WELCOME_CMD }]);
            streamOutput("markdown", terminalMarkdown(r.body));
        }
        inputRef.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle portfolio-triggered cat or open
    useEffect(() => {
        if (externalCatQueue) {
            if (externalCatQueue.startsWith("__open__")) {
                executeCommand(
                    `open ${externalCatQueue.slice("__open__".length)}`,
                );
            } else {
                executeCommand(`cat ${externalCatQueue}`);
            }
            onExternalCatConsumed?.();
        }
    }, [externalCatQueue, executeCommand, onExternalCatConsumed]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!input.trim()) return;
            setHistory((prev) => [input, ...prev]);
            setHistoryIdx(-1);
            executeCommand(input);
            setInput("");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const next = Math.min(historyIdx + 1, history.length - 1);
            setHistoryIdx(next);
            setInput(history[next] ?? "");
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = Math.max(historyIdx - 1, -1);
            setHistoryIdx(next);
            setInput(next === -1 ? "" : history[next]);
        } else if (e.key === "Tab") {
            e.preventDefault();
            // Match "cmd " + optional partial path argument
            const match = /^(\s*\S+\s+)(\S*)$/.exec(input);
            if (!match) return;
            const [, cmdPart, partial] = match;
            const completions = getCompletions(partial, cwd);
            if (completions.length === 0) return;
            if (completions.length === 1) {
                setInput(cmdPart + completions[0]);
            } else {
                pushEntry({ type: "input", text: input });
                pushEntry({ type: "text", text: completions.join("  ") });
                scrollToBottom();
            }
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            handleClear();
        }
    };

    return (
        <div
            className="h-full overflow-y-auto px-4 py-3 font-mono text-[12px] terminal-scroll cursor-text"
            style={{ background: "#0F172A" }}
            ref={outputRef}
            onClick={() => inputRef.current?.focus()}
            aria-label="Terminal"
        >
            <div className="space-y-0.5">
                {entries.map((entry, i) => (
                    <OutputLine key={i} entry={entry} />
                ))}

                {/* Inline prompt — mt-[18px] matches OutputLine input spacing, but 0 when empty */}
                <div
                    className={`flex gap-2 items-baseline ${entries.length > 0 ? "mt-[18px]" : ""}`}
                >
                    <span
                        className="select-none shrink-0"
                        style={{ color: "#22C55E" }}
                    >
                        $
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 min-w-0 bg-transparent outline-none"
                        style={{ color: "#E2E8F0", caretColor: "#22C55E" }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        aria-label="Terminal input"
                    />
                </div>
            </div>
        </div>
    );
}
