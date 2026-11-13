import type { Project } from "@/lib/content";

/* Each project drawn as a printed poster card — the texture the 3D ribbon carries.
   Same aspect as a ribbon card (2.1 : 1.32). Type is set large because a landed
   card is only ~250–400px wide on screen. */
export const POSTER_W = 1260;
export const POSTER_H = 792;

// Canvas can't resolve color-mix(), so these mirror the computed tokens in globals.css
// (claret night: INK = cream text, COBALT = coral accent, FLAME = peach glow).
const INK = "#fbf1e6";
const CARD = "#1f0d13";
const MUTED = "#c9b3a6";
const FAINT = "#a8968c";
const LINE = "rgba(247, 235, 221, 0.3)";
const COBALT = "#ff4d2e";
const COBALT_SOFT = "#33100f";
const FLAME = "#f2d4b0";
const FLAME_SOFT = "#3d2929";

const PAD = 70;
const MAX_W = POSTER_W - PAD * 2;

export interface PosterFonts {
  display: string;
  sans: string;
  mono: string;
}

export async function loadPosterFonts(): Promise<PosterFonts> {
  const css = getComputedStyle(document.body);
  const read = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const fonts = {
    display: read("--font-display", "Georgia, serif"),
    sans: read("--font-sans", "system-ui, sans-serif"),
    mono: read("--font-mono", "ui-monospace, monospace"),
  };
  // A poster drawn before its faces load bakes the fallback font into the texture.
  try {
    await Promise.all([
      document.fonts.load(`400 120px ${fonts.display}`),
      document.fonts.load(`600 44px ${fonts.sans}`),
      document.fonts.load(`400 36px ${fonts.mono}`),
      document.fonts.load(`500 36px ${fonts.mono}`),
    ]);
  } catch (err) {
    // Still draw: the fallback faces keep every poster readable.
    console.warn("[ribbon] poster fonts failed to load; using fallbacks", err);
  }
  return fonts;
}

function fit(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxW) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function halftone(ctx: CanvasRenderingContext2D): void {
  const R = 380;
  for (let x = POSTER_W - R; x < POSTER_W; x += 13) {
    for (let y = POSTER_H - R; y < POSTER_H; y += 13) {
      const a = 1 - Math.hypot(POSTER_W - x, POSTER_H - y) / R;
      if (a <= 0) continue;
      ctx.fillStyle = `rgba(255, 77, 46, ${(a * 0.32).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Honest status chip, top right. Returns its width so the category can't run under it. */
function statusChip(ctx: CanvasRenderingContext2D, p: Project, f: PosterFonts): number {
  const text = p.status.toUpperCase();
  ctx.font = `600 34px ${f.sans}`;
  ctx.letterSpacing = "3px";
  const w = ctx.measureText(text).width + 44;
  const h = 64;
  const x = POSTER_W - PAD - w;
  const [bg, fg, border] =
    p.statusKind === "ok"
      ? [COBALT_SOFT, COBALT, "rgba(255, 77, 46, 0.5)"]
      : p.statusKind === "pending"
        ? [FLAME_SOFT, FLAME, "rgba(242, 212, 176, 0.45)"]
        : [CARD, MUTED, LINE];
  ctx.beginPath();
  ctx.roundRect(x, PAD, w, h, 6);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + 22, PAD + h / 2 + 2);
  return w;
}

function arrow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.moveTo(x + w - 10, y - 10);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - 10, y + 10);
  ctx.strokeStyle = COBALT;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

/** The pipeline as chips joined by drawn arrows — mono, because these are tool names. */
function flowChips(ctx: CanvasRenderingContext2D, flow: string[], f: PosterFonts, top: number): void {
  const ARROW = 30;
  const SP = 14;
  const H = 62;
  const chipW = (node: string) => ctx.measureText(node).width + 36;
  const rowW = () =>
    flow.reduce((sum, node) => sum + chipW(node), 0) + (flow.length - 1) * (ARROW + SP * 2);
  ctx.letterSpacing = "0px";
  let size = 32;
  ctx.font = `500 ${size}px ${f.mono}`;
  while (rowW() > MAX_W && size > 22) {
    size -= 2;
    ctx.font = `500 ${size}px ${f.mono}`;
  }
  ctx.textBaseline = "middle";
  let x = PAD;
  flow.forEach((node, i) => {
    const w = chipW(node);
    ctx.beginPath();
    ctx.roundRect(x, top, w, H, 5);
    ctx.fillStyle = COBALT_SOFT;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 77, 46, 0.4)";
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.fillText(node, x + 18, top + H / 2 + 1);
    x += w;
    if (i < flow.length - 1) {
      arrow(ctx, x + SP, top + H / 2, ARROW);
      x += ARROW + SP * 2;
    }
  });
}

/** Projects without a pipeline get their description in the middle band, as many lines as fit. */
function blurb(ctx: CanvasRenderingContext2D, text: string, f: PosterFonts, top: number): void {
  const LH = 48;
  const bottom = POSTER_H - PAD - 60 - 34;
  const maxLines = Math.min(4, Math.floor((bottom - top) / LH) + 1);
  if (maxLines < 1) return;
  ctx.font = `400 36px ${f.sans}`;
  ctx.letterSpacing = "0px";
  ctx.fillStyle = MUTED;
  ctx.textBaseline = "alphabetic";
  const lines = wrap(ctx, text, MAX_W * 0.9);
  lines.slice(0, maxLines).forEach((line, i) => {
    const last = i === maxLines - 1 && lines.length > maxLines;
    ctx.fillText(last ? fit(ctx, `${line}…`, MAX_W * 0.9) : line, PAD, top + i * LH);
  });
}

function byline(ctx: CanvasRenderingContext2D, p: Project, f: PosterFonts): void {
  const H = 60;
  const y = POSTER_H - PAD - H;
  const mid = y + H / 2 + 1;
  ctx.font = `500 32px ${f.mono}`;
  ctx.letterSpacing = "1px";
  ctx.textBaseline = "middle";
  const by = "by ";
  const w = ctx.measureText(by + p.author).width + 44;
  ctx.beginPath();
  ctx.roundRect(PAD, y, w, H, H / 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = LINE;
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.fillText(by, PAD + 22, mid);
  ctx.fillStyle = COBALT;
  ctx.fillText(p.author, PAD + 22 + ctx.measureText(by).width, mid);
  if (p.stack) {
    ctx.font = `400 30px ${f.mono}`;
    ctx.fillStyle = FAINT;
    ctx.fillText(fit(ctx, p.stack.join(" · "), MAX_W - w - 28), PAD + w + 28, mid);
  }
}

export function drawPoster(canvas: HTMLCanvasElement, p: Project, f: PosterFonts): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[ribbon] 2D canvas unavailable for poster");
  ctx.fillStyle = CARD;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
  halftone(ctx);

  // Header row: category left, honest status right.
  const chipW = statusChip(ctx, p, f);
  ctx.font = `600 44px ${f.sans}`;
  ctx.letterSpacing = "4px";
  ctx.fillStyle = COBALT;
  ctx.textBaseline = "middle";
  ctx.fillText(fit(ctx, p.category.toUpperCase(), MAX_W - chipW - 30), PAD, PAD + 34);

  // Title: Caslon, at most two lines, stepping down until it fits.
  ctx.letterSpacing = "0px";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK;
  let size = 124;
  ctx.font = `400 ${size}px ${f.display}`;
  let lines = wrap(ctx, p.title, MAX_W);
  while (lines.length > 2 && size > 84) {
    size -= 8;
    ctx.font = `400 ${size}px ${f.display}`;
    lines = wrap(ctx, p.title, MAX_W);
  }
  let baseline = PAD + 64 + 52 + size * 0.78;
  lines.slice(0, 2).forEach((line, i) => {
    if (i > 0) baseline += size * 1.02;
    ctx.fillText(line, PAD, baseline);
  });

  // Role, as a mono spec caption.
  ctx.font = `400 36px ${f.mono}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(fit(ctx, p.role, MAX_W), PAD, baseline + 66);

  if (p.flow) flowChips(ctx, p.flow, f, POSTER_H - PAD - 60 - 34 - 62);
  else blurb(ctx, p.blurb, f, baseline + 66 + 70);
  byline(ctx, p, f);
}
