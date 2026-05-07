import CONTENT, { getNodeByPath, getChildNodes, TOP_LEVEL_DIRS } from "@/data/content";

// ── Path utilities ────────────────────────────────────────

export function resolvePath(cwd: string, input: string): string {
  if (input.startsWith("/")) return normalizePath(input);
  if (input === "..") {
    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    return parts.length === 0 ? "/" : "/" + parts.join("/");
  }
  if (input === ".") return cwd;
  const base = cwd === "/" ? "" : cwd;
  return normalizePath(`${base}/${input}`);
}

function normalizePath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }
  return "/" + resolved.join("/");
}

// ── Known directories ─────────────────────────────────────

export const KNOWN_DIRS = new Set<string>([
  "/",
  ...TOP_LEVEL_DIRS.map((d) => `/${d}`),
]);

function isDir(path: string): boolean {
  return KNOWN_DIRS.has(path);
}

// ── Command result types ──────────────────────────────────

export type CommandResult =
  | { kind: "text"; text: string }
  | { kind: "markdown"; body: string }
  | { kind: "visual"; body: string; visualProps: unknown }
  | { kind: "error"; text: string }
  | { kind: "clear" }
  | { kind: "open"; url: string; text: string }
  | { kind: "cwd_change"; newCwd: string }
  | { kind: "open_photo" };

// ── Tab completion ────────────────────────────────────────

export function getCompletions(partial: string, cwd: string): string[] {
  const lastSlash = partial.lastIndexOf("/");
  const dirPart = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : "";
  const fragment = lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial;

  // Resolve the directory to search in
  const searchDir =
    dirPart === "" ? cwd :
    dirPart === "/" ? "/" :
    resolvePath(cwd, dirPart.slice(0, -1)); // strip trailing slash

  const candidates: string[] = [];

  // Top-level directories (only visible from root)
  if (searchDir === "/") {
    for (const d of TOP_LEVEL_DIRS) {
      candidates.push(d + "/");
    }
  }

  // Files inside searchDir
  for (const child of getChildNodes(searchDir)) {
    candidates.push(child.path.split("/").pop()!);
  }

  return candidates
    .filter((c) => c.startsWith(fragment))
    .map((c) => dirPart + c);
}

// ── Main dispatcher ───────────────────────────────────────

export function runCommand(raw: string, cwd: string): CommandResult {
  const trimmed = raw.trim();
  if (!trimmed) return { kind: "text", text: "" };

  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd) {
    case "help":    return cmdHelp();
    case "ls":      return cmdLs(args[0], cwd);
    case "cat":     return cmdCat(args[0], cwd);
    case "open":    return cmdOpen(args[0], cwd);
    case "cd":      return cmdCd(args[0], cwd);
    case "pwd":     return { kind: "text", text: cwd };
    case "whoami":  return cmdWhoami();
    case "clear":   return { kind: "clear" };
    case "photo":   return { kind: "open_photo" };
    default:
      return {
        kind: "error",
        text: `command not found: ${cmd}\nType \`help\` for available commands.`,
      };
  }
}

// ── Commands ──────────────────────────────────────────────

function cmdHelp(): CommandResult {
  return {
    kind: "text",
    text: `Available commands:

  help       show this message
  ls [dir]   list files in current or given directory
  cat <file> display file contents
  open <file>open external URL for a file
  cd <dir>   change directory
  pwd        print working directory
  whoami     short bio
  photo      open profile photo in a preview window
  clear      clear terminal  (Ctrl+L)

  ↑↓ → history`,
  };
}

function cmdLs(arg: string | undefined, cwd: string): CommandResult {
  const target = arg ? resolvePath(cwd, arg) : cwd;

  if (!isDir(target)) {
    return { kind: "error", text: `ls: ${target}: No such directory` };
  }

  if (target === "/") {
    const dirs = TOP_LEVEL_DIRS.map((d) => `${d}/`);
    const files = CONTENT.filter(
      (n) => n.path.startsWith("/") && !n.path.slice(1).includes("/")
    ).map((n) => n.id.replace(/.*\//, ""));
    return { kind: "text", text: [...dirs, ...files].join("  ") };
  }

  const children = getChildNodes(target);
  if (!children.length) return { kind: "text", text: "(empty)" };

  const names = children.map((n) => n.path.split("/").pop()!);
  return { kind: "text", text: names.join("  ") };
}

function cmdCat(arg: string | undefined, cwd: string): CommandResult {
  if (!arg) return { kind: "error", text: "cat: missing file argument" };

  const resolved = resolvePath(cwd, arg);
  const node = getNodeByPath(resolved);

  if (!node) {
    return {
      kind: "error",
      text: `cat: ${arg}: No such file\nTry \`ls\` to see available files.`,
    };
  }

  if (node.renderType === "markdown") {
    return { kind: "markdown", body: node.body };
  }
  if (node.renderType === "visual") {
    return { kind: "visual", body: node.body, visualProps: node.visualProps };
  }
  return { kind: "text", text: node.body };
}

function cmdOpen(arg: string | undefined, cwd: string): CommandResult {
  if (!arg) return { kind: "error", text: "open: missing file argument" };

  const resolved = resolvePath(cwd, arg);
  const node = getNodeByPath(resolved);

  if (!node) return { kind: "error", text: `open: ${arg}: No such file` };

  if (!node.externalUrl) {
    return {
      kind: "error",
      text: `open: ${arg}: no external URL associated with this file`,
    };
  }

  return {
    kind: "open",
    url: node.externalUrl,
    text: `Opening ${node.title} in a new tab...`,
  };
}

function cmdCd(arg: string | undefined, cwd: string): CommandResult {
  if (!arg || arg === "~" || arg === "/") {
    return { kind: "cwd_change", newCwd: "/" };
  }

  const resolved = resolvePath(cwd, arg);
  if (!isDir(resolved)) {
    return { kind: "error", text: `cd: ${arg}: No such directory` };
  }

  return { kind: "cwd_change", newCwd: resolved };
}

function cmdWhoami(): CommandResult {
  const bio = CONTENT.find((n) => n.id === "bio.md");
  return {
    kind: "text",
    text: bio
      ? `${bio.title}\n${bio.short}\n\nType \`cat /bio.md\` to read more.`
      : "Unknown user. Update /bio.md to fix this.",
  };
}

