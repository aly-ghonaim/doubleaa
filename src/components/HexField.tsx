"use client";

import { useEffect, useRef } from "react";

/* Site background: a faint hexagon lattice whose edges carry travelling coral and aqua
   signals, drifting gently with scroll. Raw WebGL1, one full-screen triangle, ~30fps,
   paused when the tab is hidden; reduced motion gets a single still frame. */

const CELL_PX = 62; // hexagon size in CSS px
const FPS = 30;

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAG = `precision mediump float;
uniform vec2 uRes;uniform float uTime;uniform float uScroll;uniform float uCell;
const vec3 CORAL=vec3(1.,.302,.18);const vec3 AQUA=vec3(.18,.902,.784);const vec3 INK=vec3(.984,.945,.902);
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
void main(){
  vec2 frag=gl_FragCoord.xy;frag.y+=uScroll*.18;
  vec2 uv=frag/uCell;
  vec2 r=vec2(1.,1.7320508);vec2 h=r*.5;
  vec2 a=mod(uv,r)-h;vec2 b=mod(uv-h,r)-h;
  vec2 gv=dot(a,a)<dot(b,b)?a:b;
  vec2 id=uv-gv;
  vec2 q=abs(gv);
  float e=.5-max(dot(q,normalize(r)),q.x);            // distance to the cell edge
  float px=1./uCell;
  float line=smoothstep(px*1.6,0.,e);
  // slow waves of brightness roll across the lattice
  float wave=.55+.45*sin(id.x*.35+id.y*.22-uTime*.35);
  vec3 col=INK*line*.07*wave;float alpha=line*.07*wave;
  // some cells carry a signal that runs around their perimeter
  float h1=hash(id);float h2=hash(id+7.13);
  if(h1>.84){
    float ang=atan(gv.y,gv.x)/6.2831853+.5;
    float dir=h2>.5?1.:-1.;
    float ph=fract(ang*dir-uTime*(.05+h1*.08)-h2*3.);
    float trail=smoothstep(.72,1.,ph)*step(ph,.995);
    float glow=trail*(line+exp(-e*uCell*.18)*.55);
    vec3 c=h2>.45?CORAL:AQUA;
    col+=c*glow*.85;alpha+=glow*.75;
  }
  // fade toward the edges of the screen so the content area stays calm
  vec2 s=gl_FragCoord.xy/uRes-.5;
  float vig=smoothstep(.95,.2,length(s*vec2(1.,1.25)));
  alpha*=mix(.45,1.,vig);col*=mix(.45,1.,vig);
  gl_FragColor=vec4(col,clamp(alpha,0.,1.));
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("[hexfield] createShader failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(`[hexfield] ${gl.getShaderInfoLog(sh)}`);
  return sh;
}

export function HexField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!canvas || !gl) return; // no WebGL: the body glows still carry the background

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(`[hexfield] ${gl.getProgramInfoLog(prog)}`);
    } catch (err) {
      console.error(err);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uCell = gl.getUniformLocation(prog, "uCell");

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      // CSS sizes the canvas (100lvh), so address-bar slides on phones leave it alone
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };

    const start = performance.now();
    function draw(now: number) {
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.uniform1f(uScroll, window.scrollY * dpr);
      gl!.uniform1f(uCell, CELL_PX * dpr);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    };

    const redraw = () => draw(performance.now());
    resize();
    window.addEventListener("resize", resize);
    if (still) window.addEventListener("scroll", redraw, { passive: true });
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", redraw);
      // free GPU objects but keep the context: a remount (React dev) reuses this canvas
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return <canvas ref={ref} className="hex-field" aria-hidden="true" />;
}
