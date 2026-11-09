import * as THREE from "three";
import type { Project } from "@/lib/content";
import { POSTER_H, POSTER_W, drawPoster, loadPosterFonts } from "@/lib/poster";

/* The work ribbon: one scroll number p (0–1) slides a strip of poster cards along a
   fixed 3D rail, then each card flies to its slot in the landed grid. Rail, card
   strip and two-sided shader follow the "Video Ribbon" spec; the look is ours. */

export interface RibbonDom {
  track: HTMLElement;
  stage: HTMLElement;
  head: HTMLElement;
  labels: HTMLElement[];
  pill: HTMLElement;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const out = (t: number) => 1 - (1 - t) ** 3;
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

// Rail and card strip (spec values).
const FOV = 35;
const CARD_W = 2.1;
const CARD_H = 1.32;
const STEP = CARD_W + 0.03;
const NX = 28;
const NY = 3;
const SAMPLES = 1200;
const PH0 = -1.5;
const PH1 = Math.PI * 2 + 1.35;
const GZ = 8;
const RADIUS = 0.035;

// Timeline, in scroll progress.
const RIB_A = 0.02;
const RIB_B = 0.62;
const FLY = 0.13;
const LABEL_A = 0.7;
const LABEL_B = 0.84;
const SMOOTH = 0.12;
const LEAD = 0.5; // progress starts when the track top reaches mid-viewport, so the ribbon is already arriving

// Landed grid, in CSS px. Matches .wrap so the cards sit under the heading.
const WRAP_MAX = 1200;
const WRAP_PAD = 24;
const COL_GAP = 0.017;
const LABEL_PX = 30;
const ROW_GAP_PX = 22;
const HEAD_GAP_PX = 24;
const BOTTOM_PX = 32;

const VERT = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
// Rounded-rect SDF; back faces flip uv.x so a poster never reads mirrored; a hairline cream edge.
const FRAG = `uniform sampler2D map;uniform float aspect,radius;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  vec3 c=texture2D(map,uv).rgb;
  float edge=smoothstep(-.006-px,-.006,d);
  gl_FragColor=vec4(mix(c,vec3(.969,.922,.867),edge*.3),a);
}`;

interface Rail {
  length: number;
  points: THREE.Vector3[];
  tangents: THREE.Vector3[];
}

function buildRail(): Rail {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    const ph = mix(PH0, PH1, t);
    const cs = Math.cos(ph);
    const u = 2 * t - 1;
    // a shallow arc close to the camera, then long runs far behind it
    const depth = cs > 0 ? 7.6 + 16.4 * cs ** 0.9 : 7.6 + 2.2 * cs;
    const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
    pts.push(
      new THREE.Vector3(
        edge * Math.sin(ph) * depth * 0.561,
        0.5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * 0.63,
        -depth,
      ),
    );
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  curve.arcLengthDivisions = 1500;
  const points: THREE.Vector3[] = [];
  const tangents: THREE.Vector3[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    points.push(curve.getPointAt(i / SAMPLES));
    tangents.push(curve.getTangentAt(i / SAMPLES));
  }
  return { length: curve.getLength(), points, tangents };
}

interface Card {
  i: number;
  geo: THREE.PlaneGeometry;
  mat: THREE.ShaderMaterial;
  tex: THREE.CanvasTexture;
  mesh: THREE.Mesh;
}

/** A landed slot in stage px (centre + size), plus the side it flies in from. */
interface Slot {
  x: number;
  y: number;
  w: number;
  h: number;
  dxn: number; // -1 (left edge) … 1 (right edge)
  dy: number; // 1 = from above, -1 = from below
}

export async function mountRibbon(dom: RibbonDom, rows: Project[][]): Promise<() => void> {
  const { track, stage, head, labels, pill } = dom;
  const projects = rows.flat();
  const fonts = await loadPosterFonts();

  const canvas = document.createElement("canvas");
  canvas.className = "ribbon-canvas";
  stage.insertBefore(canvas, labels[0] ?? null);

  // Throws when WebGL is unavailable; the caller falls back to the static grid.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // passthrough: posters keep the CSS token colours
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  const rail = buildRail();
  const anisotropy = renderer.capabilities.getMaxAnisotropy();

  const cards: Card[] = projects.map((project, i) => {
    const poster = document.createElement("canvas");
    poster.width = POSTER_W;
    poster.height = POSTER_H;
    drawPoster(poster, project, fonts);
    const tex = new THREE.CanvasTexture(poster);
    tex.colorSpace = THREE.NoColorSpace;
    tex.anisotropy = anisotropy;
    const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        map: { value: tex },
        aspect: { value: CARD_W / CARD_H },
        radius: { value: RADIUS },
      },
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.visible = false;
    scene.add(mesh);
    return { i, geo, mat, tex, mesh };
  });

  /* ---------- layout ---------- */
  let W = 1;
  let H = 1;
  let asp = 1;
  let tanH = Math.tan((FOV * Math.PI) / 360);
  let slots: Slot[] = [];

  function layout(): void {
    const sr = stage.getBoundingClientRect();
    W = sr.width;
    H = sr.height;
    asp = W / H;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    camera.aspect = asp;
    // below 16:9 keep the horizontal view fixed so the ribbon is never squashed
    camera.fov = asp < 16 / 9 ? (Math.atan(0.561 / asp) * 360) / Math.PI : FOV;
    camera.updateProjectionMatrix();
    tanH = Math.tan((camera.fov * Math.PI) / 360);

    // Each row fills the column width (Web: 3 larger cards, Automation: 4), scaled down
    // together if the two rows would run past the bottom of the stage.
    const top = head.getBoundingClientRect().bottom - sr.top + HEAD_GAP_PX;
    const gridW = Math.min(WRAP_MAX, W) - WRAP_PAD * 2;
    const left = (W - gridW) / 2;
    const gap = gridW * COL_GAP;
    const aspect = CARD_W / CARD_H;
    const widths = rows.map((r) => (gridW - gap * (r.length - 1)) / r.length);
    const cardsH = widths.reduce((sum, w) => sum + w / aspect, 0);
    const room = H - top - BOTTOM_PX - rows.length * LABEL_PX - (rows.length - 1) * ROW_GAP_PX;
    const s = clamp(room / cardsH, 0.2, 1);

    slots = [];
    let y = top;
    rows.forEach((row, r) => {
      const n = row.length;
      const cw = widths[r] * s;
      const ch = cw / aspect;
      const g = gap * s;
      const label = labels[r];
      if (label) {
        label.style.transform = `translate(${left}px, ${y}px)`;
        label.style.width = `${n * cw + (n - 1) * g}px`;
      }
      y += LABEL_PX;
      for (let c = 0; c < n; c++) {
        slots.push({
          x: left + cw / 2 + c * (cw + g),
          y: y + ch / 2,
          w: cw,
          h: ch,
          dxn: n > 1 ? (c - (n - 1) / 2) / ((n - 1) / 2) : 0,
          dy: r === 0 ? 1 : -1,
        });
      }
      y += ch + ROW_GAP_PX;
    });
  }

  /* ---------- poses ---------- */
  const op = new THREE.Vector3();
  const ot = new THREE.Vector3();
  const up = new THREE.Vector3();
  const vp = new THREE.Vector3();
  const Y = new THREE.Vector3(0, 1, 0);

  function railAt(s: number): void {
    const f = clamp(s / rail.length) * SAMPLES;
    const i = Math.min(SAMPLES - 1, Math.floor(f));
    const k = f - i;
    op.lerpVectors(rail.points[i], rail.points[i + 1], k);
    ot.lerpVectors(rail.tangents[i], rail.tangents[i + 1], k).normalize();
  }

  function poseRibbon(card: Card, centre: number): void {
    const pos = card.geo.attributes.position;
    for (let iy = 0; iy <= NY; iy++) {
      for (let ix = 0; ix <= NX; ix++) {
        railAt(centre + (ix / NX - 0.5) * CARD_W);
        // keep the sheet upright: world Y made perpendicular to the tangent
        up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
        vp.copy(op).addScaledVector(up, (0.5 - iy / NY) * CARD_H);
        pos.setXYZ(iy * (NX + 1) + ix, vp.x, vp.y, vp.z);
      }
    }
    pos.needsUpdate = true;
  }

  function poseGrid(card: Card, q: number): void {
    const sl = slots[card.i];
    const vh = 2 * GZ * tanH;
    const vw = vh * asp;
    const gx = (sl.x / W - 0.5) * vw;
    const gy = (0.5 - sl.y / H) * vh;
    const gw = (sl.w / W) * vw;
    const gh = (sl.h / H) * vh;
    // fly in from its own side with a small tilt: outer cards from the sides, inner from above/below
    const ox = sl.dxn * 0.744 * vw * (1 - q);
    const oy = sl.dy * vh * (Math.abs(sl.dxn) < 0.5 ? 0.95 : 0.34) * (1 - q);
    const tilt = (1 - q) * 0.22 * (sl.dxn || 0.5) * sl.dy;
    const cs = Math.cos(tilt);
    const sn = Math.sin(tilt);
    const pos = card.geo.attributes.position;
    for (let iy = 0; iy <= NY; iy++) {
      for (let ix = 0; ix <= NX; ix++) {
        const x = (ix / NX - 0.5) * gw;
        const y = (0.5 - iy / NY) * gh;
        pos.setXYZ(
          iy * (NX + 1) + ix,
          gx + ox + x * cs - y * sn,
          gy + oy + x * sn + y * cs,
          -GZ - (1 - q) * 0.6 * Math.sin((ix / NX) * Math.PI),
        );
      }
    }
    pos.needsUpdate = true;
  }

  /* ---------- render ---------- */
  let p = 0;
  let target = 0;

  function render(): void {
    const total = rail.length + cards.length * STEP;
    const headS = mix(0, total, span(p, RIB_A, RIB_B));
    const end = rail.length - CARD_W;
    for (const card of cards) {
      const s = headS - card.i * STEP;
      if (s < end) {
        card.mesh.visible = s > CARD_W;
        if (card.mesh.visible) poseRibbon(card, s);
      } else {
        // each card flies to its slot the moment it leaves the rail
        const st = mix(RIB_A, RIB_B, (end + card.i * STEP) / total);
        const q = out(span(p, st, st + FLY));
        card.mesh.visible = q > 0.001;
        if (card.mesh.visible) poseGrid(card, q);
      }
    }
    const draw = ease(span(p, LABEL_A, LABEL_B));
    for (const label of labels) {
      label.style.opacity = String(draw);
      label.style.setProperty("--draw", String(draw));
    }
    if (p <= LABEL_B) pill.style.opacity = "0";
    renderer.render(scene, camera);
  }

  /* ---------- scroll + loop ---------- */
  function readScroll(): void {
    const r = track.getBoundingClientRect();
    const lead = H * LEAD;
    target = clamp((lead - r.top) / (r.height - H + lead));
  }

  let raf = 0;
  let dirty = true;
  function frame(): void {
    raf = requestAnimationFrame(frame);
    const prev = p;
    p += (target - p) * SMOOTH;
    if (Math.abs(target - p) < 5e-5) p = target;
    if (p !== prev || dirty) {
      dirty = false;
      render();
    }
  }

  function onResize(): void {
    layout();
    readScroll();
    dirty = true;
  }

  // Only spin the loop while the track is on screen.
  const io = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf);
    if (entry?.isIntersecting) {
      dirty = true;
      raf = requestAnimationFrame(frame);
    }
  });
  const ro = new ResizeObserver(onResize);

  /* ---------- hover: title + full description once the grid has landed ---------- */
  const pillTitle = pill.querySelector("b");
  const pillBlurb = pill.querySelector("span");
  let shown = -1;
  function onMove(e: PointerEvent): void {
    const sr = stage.getBoundingClientRect();
    const x = e.clientX - sr.left;
    const y = e.clientY - sr.top;
    const hit =
      p > LABEL_B
        ? slots.findIndex((s) => Math.abs(x - s.x) < s.w / 2 && Math.abs(y - s.y) < s.h / 2)
        : -1;
    if (hit < 0) {
      pill.style.opacity = "0";
      return;
    }
    if (hit !== shown && pillTitle && pillBlurb) {
      shown = hit;
      pillTitle.textContent = projects[hit].title;
      pillBlurb.textContent = projects[hit].blurb;
    }
    const pw = pill.offsetWidth;
    const ph = pill.offsetHeight;
    const px = x + 16 + pw > W ? x - 16 - pw : x + 16;
    const py = Math.max(8, Math.min(y + 18, H - ph - 8));
    pill.style.transform = `translate(${px}px, ${py}px)`;
    pill.style.opacity = "1";
  }
  function onLeave(): void {
    pill.style.opacity = "0";
  }

  layout();
  readScroll();
  p = target;
  window.addEventListener("scroll", readScroll, { passive: true });
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  io.observe(track);
  ro.observe(stage);
  ro.observe(head);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("scroll", readScroll);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    for (const card of cards) {
      card.geo.dispose();
      card.mat.dispose();
      card.tex.dispose();
    }
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
