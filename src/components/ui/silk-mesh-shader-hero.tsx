"use client"

import * as React from "react"

// A full-bleed hero painted by one fragment shader: domain-warped silk that folds
// and catches the light, a fine mesh riding the same folds, and slow pulse rings.
// The cloth leans away from the pointer, and a click sends a ripple through it.

export type SilkPalette = {
  /** Shadow, body, fold and highlight colours, dark to light. */
  colors: [string, string, string, string]
  /** Text colour over the silk. */
  text: string
}

export const SILK_PALETTES = {
  claret: { colors: ["#16050a", "#5e1120", "#b5493c", "#f2d4b0"], text: "#f7ebdd" },
  dune: { colors: ["#20140c", "#7a4d31", "#c99a6c", "#fbefe1"], text: "#fff7ee" },
  moss: { colors: ["#06110d", "#1b4233", "#6a946a", "#e6efcf"], text: "#f2f6e6" },
} satisfies Record<string, SilkPalette>

export type SilkPaletteName = keyof typeof SILK_PALETTES

export type SilkCta = { label: string; href?: string; onClick?: () => void }

export type SilkMeshShaderHeroProps = {
  eyebrow?: string
  /** Headline. Wrap a word in *asterisks* to set it in italic. Use \n for a line break. */
  title?: string
  description?: React.ReactNode
  primaryCta?: SilkCta
  secondaryCta?: SilkCta
  /** Small caption, bottom right. */
  caption?: string
  palette?: SilkPaletteName | SilkPalette
  /** Overall speed of the cloth. */
  speed?: number
  /** Opacity of the mesh lines, 0 to hide. */
  mesh?: number
  /** Show the slow pulse rings. */
  rings?: boolean
  /** Stage height. Keep it a definite length; percentages collapse once installed. */
  height?: string
  className?: string
}

// #region shader-math
/** "#rrggbb" or "#rgb" to 0-1 RGB. */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim()
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = parseInt(h.slice(0, 6), 16)
  if (Number.isNaN(n) || h.length < 6) return [0, 0, 0]
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/** Canvas backing size: CSS size times a device ratio capped at 2. */
export function backing(css: number, dpr: number): number {
  return Math.max(1, Math.round(css * Math.min(2, Math.max(1, dpr || 1))))
}

/** Pointer in shader space: centred, y up, height spans -0.5..0.5. */
export function toShader(x: number, y: number, w: number, h: number): [number, number] {
  if (w <= 0 || h <= 0) return [0, 0]
  return [(x - w / 2) / h, (h / 2 - y) / h]
}

/** Splits "a *b* c" into plain and italic runs. */
export function runs(line: string): { text: string; em: boolean }[] {
  return line.split("*").map((text, i) => ({ text, em: i % 2 === 1 })).filter((r) => r.text)
}
// #endregion

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"

const FRAG =
  "precision highp float;" +
  "uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uHover;uniform float uIntro;" +
  "uniform vec3 uC0;uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;uniform float uMesh;uniform float uRings;" +
  "uniform vec2 uClick;uniform float uClickAge;" +
  "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}" +
  "float silk(vec2 p,float t){vec2 w=p*2.1;for(int i=1;i<7;i++){float fi=float(i);w+=vec2(.62/fi*sin(fi*w.y*.85+t*.32+fi*1.7),.5/fi*cos(fi*w.x*.75-t*.26+fi*.9));}return .5+.5*sin(w.x*1.9+w.y*1.2);}" +
  "void main(){" +
  "vec2 uv=gl_FragCoord.xy/uRes;vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;float t=uTime;" +
  // the cloth leans away from the pointer
  "vec2 dm=p-uMouse;float md=dot(dm,dm);p+=dm*.22*exp(-md*7.)*uHover;" +
  // a click ripple travels outwards and fades
  "vec2 dc=p-uClick;float cd=length(dc);float wave=sin(cd*26.-uClickAge*9.)*exp(-uClickAge*1.1)*smoothstep(uClickAge*.75+.05,uClickAge*.75-.25,cd);" +
  "p+=normalize(dc+1e-4)*wave*.018;" +
  "float h0=silk(p,t);vec2 e=vec2(.004,0.);float hx=silk(p+e.xy,t)-h0;float hy=silk(p+e.yx,t)-h0;" +
  "vec3 n=normalize(vec3(-hx/e.x*.26,-hy/e.x*.26,1.));vec3 L=normalize(vec3(-.45,.6,.75));" +
  "float dif=clamp(dot(n,L),0.,1.);float spec=pow(clamp(dot(reflect(-L,n),vec3(0.,0.,1.)),0.,1.),16.);" +
  "float fold=dif;float f=h0;" +
  "vec3 col=mix(uC0,uC1,smoothstep(.0,.85,h0));" +
  "col=mix(col,uC2,smoothstep(.35,1.,dif)*.85);" +
  "col=mix(col,uC0,smoothstep(.45,.0,dif)*.55);" +
  "col+=uC3*spec*.8;" +
  "vec2 r=vec2(hx,hy)*40.;" +
  // mesh: a fine grid displaced by the same folds, strongest low in the frame
  "vec2 g=(p+r*.02+n.xy*.05)*vec2(15.,15.);vec2 gd=abs(fract(g)-.5);float line=1.-smoothstep(0.,.05,min(gd.x,gd.y));" +
  "col=mix(col,uC3,line*uMesh*(.25+.75*smoothstep(.8,.0,uv.y))*(.3+.7*dif));" +
  // slow pulse rings off to one side
  "vec2 rc=vec2(.42*uRes.x/uRes.y,-.18);float rd=length(p-rc);float ring=0.;" +
  "for(int k=0;k<3;k++){float ph=fract(t*.12+float(k)/3.);ring+=smoothstep(.004,0.,abs(rd-ph*.75))*(1.-ph)*smoothstep(0.,.08,ph);}" +
  "col+=uC3*ring*.28*uRings;" +
  "col+=uC3*smoothstep(.02,0.,abs(cd-uClickAge*.75))*exp(-uClickAge*1.6)*.25;" +
  // grade: vignette, a little grain, the intro exposure
  "float vig=smoothstep(1.25,.35,length((uv-.5)*vec2(1.1,1.3)));col*=mix(.55,1.,vig);" +
  "col+=(hash(gl_FragCoord.xy+fract(t)*91.)-.5)*.035;" +
  "col*=uIntro;" +
  "gl_FragColor=vec4(col,1.);}"

// doubleaa: the original embedded two base64 serif fonts (~100KB, unknown licence);
// the headline and body use the site's own font variables instead.
const CSS =
  ".smh-root{position:relative;width:100%;overflow:hidden;isolation:isolate;background:var(--smh-c0);color:var(--smh-text);font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif}" +
  ".smh-root *{box-sizing:border-box}" +
  ".smh-host{position:absolute;inset:0}" +
  ".smh-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:crosshair}" +
  ".smh-fallback{position:absolute;inset:0;background:radial-gradient(120% 90% at 30% 20%,var(--smh-c2),var(--smh-c1) 45%,var(--smh-c0) 100%)}" +
  ".smh-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,color-mix(in oklab,var(--smh-c0) 70%,transparent),transparent 55%)}" +
  ".smh-inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,5vw,72px);pointer-events:none}" +
  ".smh-pill{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;height:32px;padding:0 14px 0 10px;border-radius:999px;font-size:13px;font-weight:500;letter-spacing:.01em;" +
  "background:color-mix(in oklab,var(--smh-text) 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--smh-text) 22%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}" +
  ".smh-pill i{width:7px;height:7px;border-radius:50%;background:var(--smh-c3);box-shadow:0 0 0 0 var(--smh-c3);animation:smh-ping 2.4s ease-out infinite}" +
  ".smh-h{margin:22px 0 0;font-family:var(--font-display),ui-serif,Georgia,serif;font-weight:400;font-size:clamp(52px,8.6vw,148px);line-height:.92;letter-spacing:-.02em;max-width:12ch;text-wrap:balance}" +
  ".smh-h em{font-style:italic;letter-spacing:-.03em;color:var(--smh-c3)}" +
  ".smh-line{display:block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em}" +
  ".smh-line>span{display:inline-block;transform:translateY(105%);transition:transform 1.3s cubic-bezier(.16,1,.3,1)}" +
  ".smh-in .smh-line>span{transform:none}" +
  ".smh-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:28px 48px;margin-top:28px}" +
  ".smh-desc{margin:0;max-width:38ch;font-size:clamp(15px,1.25vw,18px);line-height:1.55;opacity:.82;text-wrap:pretty}" +
  ".smh-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px;pointer-events:auto}" +
  ".smh-fade{opacity:0;transform:translateY(14px);transition:opacity 1s ease .5s,transform 1.1s cubic-bezier(.16,1,.3,1) .5s}" +
  ".smh-in .smh-fade{opacity:1;transform:none}" +
  ".smh-btn{display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 22px;border-radius:999px;font-size:15px;font-weight:500;text-decoration:none;cursor:pointer;border:0;color:inherit;transition:transform .45s cubic-bezier(.3,1.5,.5,1),background-color .3s,box-shadow .3s}" +
  ".smh-btn:active{transform:scale(.96)}" +
  ".smh-btn:focus-visible{outline:2px solid var(--smh-c3);outline-offset:3px}" +
  ".smh-primary{background:var(--smh-text);color:var(--smh-c0);box-shadow:0 12px 30px -14px var(--smh-c3)}" +
  ".smh-primary:hover{transform:translateY(-2px);box-shadow:0 18px 36px -14px var(--smh-c3)}" +
  ".smh-primary svg{transition:transform .45s cubic-bezier(.3,1.5,.5,1)}" +
  ".smh-primary:hover svg{transform:translateX(4px)}" +
  ".smh-ghost{background:color-mix(in oklab,var(--smh-text) 10%,transparent);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--smh-text) 28%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}" +
  ".smh-ghost:hover{background:color-mix(in oklab,var(--smh-text) 18%,transparent);transform:translateY(-2px)}" +
  ".smh-play{display:grid;place-items:center;width:24px;height:24px;margin-left:-8px;border-radius:50%;background:var(--smh-text);color:var(--smh-c0)}" +
  ".smh-cap{font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.6;text-align:right;line-height:1.7;white-space:pre-line}" +
  "@keyframes smh-ping{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--smh-c3) 70%,transparent)}100%{box-shadow:0 0 0 10px transparent}}" +
  "@media (max-width:640px){.smh-cap{display:none}.smh-h{font-size:clamp(46px,13vw,80px)}}" +
  "@media (prefers-reduced-motion:reduce){.smh-pill i{animation:none}.smh-line>span,.smh-fade,.smh-btn,.smh-primary svg{transition:none}}"

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Cta({ cta, kind }: { cta: SilkCta; kind: "primary" | "ghost" }) {
  const cls = "smh-btn smh-" + kind
  const inner =
    kind === "primary" ? (
      <>
        {cta.label}
        <Arrow />
      </>
    ) : (
      <>
        <span className="smh-play" aria-hidden="true">
          <svg width="9" height="10" viewBox="0 0 9 10">
            <path d="M1 1l7 4-7 4z" fill="currentColor" />
          </svg>
        </span>
        {cta.label}
      </>
    )
  return cta.href ? (
    <a className={cls} href={cta.href} onClick={cta.onClick}>
      {inner}
    </a>
  ) : (
    <button type="button" className={cls} onClick={cta.onClick}>
      {inner}
    </button>
  )
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("silk-mesh-shader-hero:", gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

export default function SilkMeshShaderHero({
  eyebrow = "New — the Atelier 04 collection",
  title = "Light, *woven*\ninto motion.",
  description = "Hand-finished silks dyed in small batches, cut to move with you and catch every lamp in the room.",
  primaryCta = { label: "Explore the collection" },
  secondaryCta = { label: "Watch the film" },
  caption = "Atelier 04\nAutumn / Winter",
  palette = "claret",
  speed = 1,
  mesh = 0.14,
  rings = true,
  height = "100svh",
  className,
}: SilkMeshShaderHeroProps) {
  const root = React.useRef(null as HTMLElement | null)
  const host = React.useRef(null as HTMLDivElement | null)
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const pal = typeof palette === "string" ? SILK_PALETTES[palette] || SILK_PALETTES.claret : palette
  // Uniform inputs live in a ref so prop changes don't rebuild the GL context.
  const live = React.useRef({ pal, speed, mesh, rings })
  // doubleaa: synced in an effect, not during render (react-hooks/refs).
  React.useEffect(() => {
    live.current = { pal, speed, mesh, rings }
  })

  React.useEffect(() => {
    const el = root.current
    const holder = host.current
    if (!el || !holder) return
    // A fresh canvas per mount: a context lost on unmount can't be reused (StrictMode remounts).
    const cv = document.createElement("canvas")
    cv.className = "smh-canvas"
    holder.appendChild(cv)
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" })
    if (!gl) {
      cv.remove()
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL support is only known after mount
      setFailed(true)
      setReady(true)
      return
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()
    if (!vs || !fs || !prog) {
      cv.remove()
      setFailed(true)
      setReady(true)
      return
    }
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = (n: string) => gl.getUniformLocation(prog, n)
    const U = {
      res: u("uRes"), time: u("uTime"), mouse: u("uMouse"), hover: u("uHover"), intro: u("uIntro"),
      c0: u("uC0"), c1: u("uC1"), c2: u("uC2"), c3: u("uC3"), mesh: u("uMesh"), rings: u("uRings"),
      click: u("uClick"), clickAge: u("uClickAge"),
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    // Measured on init and resize only; the frame loop reads these numbers.
    const size = { w: 1, h: 1, left: 0, top: 0 }
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, hover: 0, thover: 0 }
    const click = { x: 9, y: 9, at: -100 }
    let raf = 0
    let running = false
    let onScreen = true
    let t = 0
    let last = performance.now()
    let intro = 0
    const start = performance.now()

    const measure = () => {
      const r = cv.getBoundingClientRect()
      size.w = r.width
      size.h = r.height
      size.left = r.left
      size.top = r.top
      cv.width = backing(r.width, window.devicePixelRatio)
      cv.height = backing(r.height, window.devicePixelRatio)
      gl.viewport(0, 0, cv.width, cv.height)
      if (!running) draw(performance.now())
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const L = live.current
      if (!reduce.matches) t += dt * L.speed
      intro = reduce.matches ? 1 : Math.min(1, (now - start) / 1600)
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06
      pointer.hover += (pointer.thover - pointer.hover) * 0.05
      const c = L.pal.colors.map(hexToRgb)
      gl.uniform2f(U.res, cv.width, cv.height)
      gl.uniform1f(U.time, t + 11)
      gl.uniform2f(U.mouse, pointer.x, pointer.y)
      gl.uniform1f(U.hover, reduce.matches ? 0 : pointer.hover)
      gl.uniform1f(U.intro, 1 - Math.pow(1 - intro, 3))
      gl.uniform3f(U.c0, c[0][0], c[0][1], c[0][2])
      gl.uniform3f(U.c1, c[1][0], c[1][1], c[1][2])
      gl.uniform3f(U.c2, c[2][0], c[2][1], c[2][2])
      gl.uniform3f(U.c3, c[3][0], c[3][1], c[3][2])
      gl.uniform1f(U.mesh, L.mesh)
      gl.uniform1f(U.rings, L.rings && !reduce.matches ? 1 : 0)
      gl.uniform2f(U.click, click.x, click.y)
      gl.uniform1f(U.clickAge, (now - click.at) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      draw(now)
      raf = running ? requestAnimationFrame(loop) : 0
    }
    const sync = () => {
      const want = onScreen && !document.hidden && !reduce.matches
      if (want && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(loop)
      } else if (!want && running) {
        running = false
        cancelAnimationFrame(raf)
        draw(performance.now())
      }
    }

    // One measurement when the pointer arrives; moves only read the cached rect.
    const onEnter = () => {
      const r = cv.getBoundingClientRect()
      size.left = r.left
      size.top = r.top
      pointer.thover = 1
    }
    const onMove = (e: PointerEvent) => {
      const [x, y] = toShader(e.clientX - size.left, e.clientY - size.top, size.w, size.h)
      pointer.tx = x
      pointer.ty = y
    }
    const onLeave = () => (pointer.thover = 0)
    const onDown = (e: PointerEvent) => {
      const [x, y] = toShader(e.clientX - size.left, e.clientY - size.top, size.w, size.h)
      click.x = x
      click.y = y
      click.at = performance.now()
    }

    const ro = new ResizeObserver(measure)
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      sync()
    })
    io.observe(el)
    document.addEventListener("visibilitychange", sync)
    reduce.addEventListener("change", sync)
    cv.addEventListener("pointerenter", onEnter)
    cv.addEventListener("pointermove", onMove)
    cv.addEventListener("pointerleave", onLeave)
    cv.addEventListener("pointerdown", onDown)
    measure()
    sync()
    setReady(true)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", sync)
      reduce.removeEventListener("change", sync)
      cv.removeEventListener("pointerenter", onEnter)
      cv.removeEventListener("pointermove", onMove)
      cv.removeEventListener("pointerleave", onLeave)
      cv.removeEventListener("pointerdown", onDown)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      cv.remove()
    }
  }, [])

  const lines = title.split("\n")
  return (
    <section
      ref={root}
      className={"smh-root" + (ready ? " smh-in" : "") + (className ? " " + className : "")}
      style={
        {
          height,
          "--smh-c0": pal.colors[0],
          "--smh-c1": pal.colors[1],
          "--smh-c2": pal.colors[2],
          "--smh-c3": pal.colors[3],
          "--smh-text": pal.text,
        } as React.CSSProperties
      }
    >
      <style>{CSS}</style>
      {failed ? <div className="smh-fallback" aria-hidden="true" /> : null}
      <div ref={host} className="smh-host" aria-hidden="true" />
      <div className="smh-shade" aria-hidden="true" />
      <div className="smh-inner">
        {eyebrow ? (
          <span className="smh-pill smh-fade">
            <i aria-hidden="true" />
            {eyebrow}
          </span>
        ) : null}
        <h1 className="smh-h">
          {lines.map((line, i) => (
            <span className="smh-line" key={i}>
              <span style={{ transitionDelay: 0.15 + i * 0.12 + "s" }}>
                {runs(line).map((r, j) => (r.em ? <em key={j}>{r.text}</em> : <React.Fragment key={j}>{r.text}</React.Fragment>))}
              </span>
            </span>
          ))}
        </h1>
        <div className="smh-row">
          <div>
            {description ? <p className="smh-desc smh-fade">{description}</p> : null}
            {primaryCta || secondaryCta ? (
              <div className="smh-ctas smh-fade">
                {primaryCta ? <Cta cta={primaryCta} kind="primary" /> : null}
                {secondaryCta ? <Cta cta={secondaryCta} kind="ghost" /> : null}
              </div>
            ) : null}
          </div>
          {caption ? <div className="smh-cap smh-fade">{caption}</div> : null}
        </div>
      </div>
    </section>
  )
}
