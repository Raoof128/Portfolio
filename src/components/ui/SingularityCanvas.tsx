"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * SingularityCanvas — a GPU-raymarched Schwarzschild black hole.
 *
 * A single WebGL2 fragment shader marches one ray per pixel, bending it toward
 * the singularity each step (conserved-angular-momentum photon deflection,
 * accel = -1.5·h²·p/r⁵) so the far side of the accretion disk lenses up and
 * over the shadow. The disk is graded to the site palette (cyan/violet/amber)
 * rather than physical blackbody orange, with relativistic Doppler beaming
 * brightening the approaching limb and a crisp photon ring at the photon sphere.
 *
 * No external library. Falls back to the wrapper's CSS nebula when WebGL2 is
 * unavailable, and renders a single frozen frame under prefers-reduced-motion.
 */

const VERT = `#version 300 es
precision highp float;
const vec2 verts[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
void main(){ gl_Position = vec4(verts[gl_VertexID], 0., 1.); }`;

function fragSource(steps: number): string {
  return `#version 300 es
precision highp float;

uniform vec2 u_res;
uniform float u_time;
out vec4 outColor;

const vec3 CY = vec3(0.000, 0.961, 1.000);   // #00F5FF cyan — brand rim/ring
const vec3 EMBER = vec3(0.32, 0.09, 0.02);   // deep ember (cool outer disk)
const vec3 AM    = vec3(0.965, 0.560, 0.180); // amber
const vec3 GOLD  = vec3(1.000, 0.760, 0.360); // gold
const vec3 HOT   = vec3(1.000, 0.945, 0.820); // warm white-hot core

const float RS     = 1.0;    // event-horizon radius (scaled units)
const float INNER  = 3.0;    // accretion-disk inner edge (~ISCO)
const float OUTER  = 12.5;   // accretion-disk outer edge
const float TH     = 0.68;   // accretion-disk half-thickness

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0 - 2.0*f);
  float a = hash21(i), b = hash21(i+vec2(1,0));
  float c = hash21(i+vec2(0,1)), d = hash21(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  for(int i=0;i<4;i++){ s += a*vnoise(p); p *= 2.03; a *= 0.5; }
  return s;
}

// Disk color ramp keyed on heat h∈[0,1] (1 = hot inner edge).
// Gargantua-warm: ember → amber → gold → warm white-hot core.
vec3 diskRamp(float h){
  vec3 c = mix(EMBER, AM, smoothstep(0.04, 0.34, h)); // ember → amber
  c = mix(c, GOLD, smoothstep(0.32, 0.66, h));         // → gold (dominant band)
  c = mix(c, HOT, smoothstep(0.74, 1.0, h));           // → warm white-hot
  return c;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float aspect = u_res.x / u_res.y;
  // On wide screens push the hole right so the left stays dark for the headline;
  // on portrait (mobile) centre it and zoom out so it stays fully in frame.
  float wide = smoothstep(0.8, 1.4, aspect);
  float off = mix(0.12, 0.30, wide);   // portrait: near-centre, landscape: right
  float yoff = mix(-0.30, -0.01, wide); // portrait: drop below the headline
  float zoom = mix(1.85, 1.05, wide);   // portrait: zoom out so it stays small
  vec2 aim = uv - vec2(off, yoff);

  // Autonomous cinematic camera — a slow sway with inclination breathing so
  // the disk turns, opens and closes on its own (seamless, never stalls).
  // Kept near edge-on (Interstellar/Gargantua) so the disk wraps into a
  // near-complete halo over AND under the shadow.
  float yaw = sin(u_time * 0.085) * 0.34;
  float pit = 0.098 + sin(u_time * 0.125 + 1.0) * 0.035;
  float cd = 16.5;
  vec3 ro = vec3(sin(yaw)*cd, sin(pit)*cd, -cos(yaw)*cos(pit)*cd);
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(fw, vec3(0,1,0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw + (aim.x*rt + aim.y*up) * zoom);

  vec3 p = ro;
  vec3 v = rd;
  vec3 hvec = cross(p, v);
  float h2 = dot(hvec, hvec);

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float minR = 1e9;
  bool captured = false;

  // Volumetric march: bend the ray toward the singularity each step and
  // accumulate accretion-disk emission wherever it passes through the disk
  // slab. Absorption (front-to-back) lets the near disk occlude the lensed
  // images behind it, so the multiple images blend instead of aliasing.
  for(int i=0; i<${steps}; i++){
    float r2 = dot(p, p);
    float r = sqrt(r2);
    minR = min(minR, r);

    if(r2 < RS*RS){ captured = true; break; }
    if(r2 > 1600.0) break;
    if(alpha > 0.995) break;

    // Adaptive step: coarse far out, fine near the hole and near the disk
    // plane so the thin slab is never skipped.
    float dt = clamp(r * 0.13, 0.22, 1.1);
    dt = min(dt, abs(p.y) * 0.65 + 0.12);

    if(abs(p.y) < TH){
      float rc2 = p.x*p.x + p.z*p.z;
      if(rc2 > INNER*INNER && rc2 < OUTER*OUTER){
        float rc = sqrt(rc2);
        float pang = atan(p.z, p.x);
        float heat = clamp(1.0 - (rc-INNER)/(OUTER-INNER), 0.0, 1.0);
        float kep = pow(INNER/rc, 1.5);              // keplerian angular speed
        float spin = u_time * 0.26 * kep;
        float cs = cos(spin), sn = sin(spin);
        vec2 q = mat2(cs,-sn,sn,cs) * p.xz;
        // Silky turbulence — soft banding, low contrast, for the creamy
        // Double-Negative disk rather than a noisy one.
        float swirl = fbm(q * 0.45 + vec2(rc * 0.2, 0.0));
        swirl = mix(0.5, swirl, 0.72) * (0.85 + 0.22 * fbm(q * 1.4 - u_time * 0.04));
        float vprof = 1.0 - smoothstep(0.0, TH, abs(p.y)); // fade at slab faces
        float edge = smoothstep(INNER, INNER+0.5, rc)
                   * smoothstep(OUTER, OUTER-3.2, rc);

        // Doppler beaming, dialled WAY down — Nolan/Thorne muted the brightness
        // asymmetry so Gargantua's halo reads evenly bright top and bottom.
        vec3 orb = normalize(vec3(-p.z, 0.0, p.x));
        float dop = dot(orb, normalize(-v));
        float beam = clamp(1.0 + 0.28*dop, 0.68, 1.4);

        // A faint warm hot-spot drifting round the inner disk — subtle life,
        // not a strobe.
        float hot = pow(max(cos(pang - u_time * 0.5), 0.0), 40.0)
                  * smoothstep(6.5, INNER + 0.4, rc);

        float emis = heat*heat * (0.45 + 0.75*swirl) * vprof * beam * edge
                   * (1.0 + hot * 1.8);
        vec3 dc = diskRamp(heat);
        dc = mix(dc, HOT, clamp(dop*0.14, 0.0, 0.22));       // gentle limb warm-white
        dc = mix(dc, vec3(1.0, 0.94, 0.82), clamp(hot, 0.0, 0.5)); // warm flare

        float local = emis * dt * 1.25;
        col += dc * local * (1.5 - alpha) * 0.78;
        alpha += clamp(local, 0.0, 1.0) * (1.0 - alpha);
      }
    }

    vec3 accel = -1.5 * h2 * p / (r2 * r2 * r);
    v += accel * dt;
    p += v * dt;
  }

  // Rays that fall past the horizon carry the faint higher-order disk images
  // that read as onion rings inside the shadow — darken them to a clean void.
  if(captured) col *= 0.03;

  float atten = 1.0 - alpha*0.7;

  // Cyan photon ring — the brand signature hugging the warm shadow. Grazing
  // rays pile up at the photon sphere (1.5·RS); a faint shimmer keeps it alive.
  float pr = abs(minR - 1.5);
  float shim = 0.88 + 0.12 * sin(u_time * 2.1);
  col += CY * pow(smoothstep(0.75, 0.0, pr), 2.0) * 1.2 * shim * atten;
  col += vec3(0.75, 1.0, 1.0) * smoothstep(0.1, 0.0, pr)
       * (0.85 + 0.15 * sin(u_time * 3.0)) * atten;

  // Lensed background starfield (uses the bent escape direction) — crisp points.
  if(!captured){
    vec3 sd = normalize(v);
    vec2 suv = vec2(atan(sd.z, sd.x) * 3.5, sd.y * 4.0);
    vec2 g = suv * 26.0;
    vec2 id = floor(g);
    vec2 f = fract(g);
    float rnd = hash21(id);
    vec2 sp = vec2(hash21(id + 1.7), hash21(id + 4.3));
    float d = length(f - sp);
    float star = smoothstep(0.09, 0.0, d) * step(0.86, rnd);
    float tw = 0.6 + 0.4*sin(u_time*1.4 + rnd*30.0);
    vec3 sc = mix(vec3(0.8,0.88,1.0), CY, step(0.6, hash21(id + 9.1)));
    col += sc * star * tw * 0.55 * atten;
  }

  // Bloom — a soft cyan halo hugging the shadow plus a tighter hot core glow.
  float rr = length(aim);
  col += CY * 0.05 * exp(-rr*3.4) * atten;
  col += vec3(0.6, 0.92, 1.0) * 0.04 * exp(-rr*7.5) * atten;

  // Reinhard tone map + slight lift, with a touch of saturation for punch.
  col = col / (col + vec3(0.72));
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, 1.32);
  col = pow(max(col, 0.0), vec3(0.85));

  outColor = vec4(col, 1.0);
}`;
}

export function SingularityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const run = useCallback(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return; // fall back to the wrapper's CSS nebula

    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let program: WebGLProgram | null = null;
    let compiledSteps = -1;
    let uRes: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;

    let rafId: number | null = null;
    let inView = true;
    let contextLost = false;
    let lastTs = 0;
    let elapsed = 0;

    // Runtime performance guard: if the opening second runs slow, drop to a
    // lighter tier once so weak/integrated GPUs stay smooth.
    let degraded = false;
    let perfFrames = 0;
    let perfSlow = 0;
    let perfDone = false;

    function qualitySteps(): number {
      if (rmq.matches) return 90;
      if (degraded) return width < 640 ? 84 : 108;
      if (width < 640) return 122;
      if (width < 1024) return 140;
      return 170;
    }
    function renderScale(): number {
      if (rmq.matches) return 0.7;
      if (degraded) return 0.58;
      if (width < 640) return 0.72;
      return 0.8;
    }

    function compile(type: number, src: string): WebGLShader | null {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(sh);
        return null;
      }
      return sh;
    }

    function buildProgram(steps: number): boolean {
      const vs = compile(gl!.VERTEX_SHADER, VERT);
      const fs = compile(gl!.FRAGMENT_SHADER, fragSource(steps));
      if (!vs || !fs) return false;
      const prog = gl!.createProgram();
      if (!prog) return false;
      gl!.attachShader(prog, vs);
      gl!.attachShader(prog, fs);
      gl!.linkProgram(prog);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      if (!gl!.getProgramParameter(prog, gl!.LINK_STATUS)) {
        gl!.deleteProgram(prog);
        return false;
      }
      if (program) gl!.deleteProgram(program);
      program = prog;
      compiledSteps = steps;
      uRes = gl!.getUniformLocation(prog, "u_res");
      uTime = gl!.getUniformLocation(prog, "u_time");
      gl!.useProgram(prog);
      return true;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const scale = renderScale();
      const cap = 1600;
      let bw = Math.round(width * scale);
      let bh = Math.round(height * scale);
      const longest = Math.max(bw, bh);
      if (longest > cap) {
        const k = cap / longest;
        bw = Math.round(bw * k);
        bh = Math.round(bh * k);
      }
      canvas.width = bw;
      canvas.height = bh;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      gl!.viewport(0, 0, bw, bh);
      const want = qualitySteps();
      if (want !== compiledSteps) buildProgram(want);
    }

    function render() {
      if (!program) return;
      gl!.useProgram(program);
      if (uRes) gl!.uniform2f(uRes, canvas.width, canvas.height);
      if (uTime) gl!.uniform1f(uTime, elapsed);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function frame(ts: number) {
      if (contextLost) return;
      const dt = lastTs > 0 ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
      lastTs = ts;
      elapsed += dt;
      render();

      // Sample frame times after a short warm-up; degrade once if >40% slow.
      if (!perfDone && !degraded && dt > 0 && elapsed > 0.6) {
        perfFrames++;
        if (dt > 1 / 45) perfSlow++;
        if (perfFrames >= 90) {
          perfDone = true;
          if (perfSlow > 36) {
            degraded = true;
            resize();
          }
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      lastTs = 0;
    }
    function start() {
      if (contextLost || document.hidden || !inView) return;
      if (rmq.matches) {
        elapsed = 8.0; // frozen representative frame
        render();
        return;
      }
      if (rafId !== null) return;
      rafId = requestAnimationFrame(frame);
    }

    const onResize = () => {
      resize();
      if (rmq.matches) render();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onRmqChange = () => {
      stop();
      resize();
      start();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      stop();
    };
    const onRestored = () => {
      contextLost = false;
      compiledSteps = -1;
      program = null;
      resize();
      start();
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) start();
        else stop();
      },
      { threshold: 0.02 },
    );
    io.observe(canvas);

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    window.addEventListener("resize", onResize, { passive: true });
    rmq.addEventListener?.("change", onRmqChange);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      window.removeEventListener("resize", onResize);
      rmq.removeEventListener?.("change", onRmqChange);
      document.removeEventListener("visibilitychange", onVisibility);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  useEffect(() => {
    const cleanup = run();
    return cleanup;
  }, [run]);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(0,245,255,0.06), transparent 24%), " +
          "radial-gradient(circle at 34% 22%, rgba(139,92,246,0.10), transparent 28%), " +
          "radial-gradient(circle at 68% 78%, rgba(246,200,95,0.05), transparent 22%), " +
          "linear-gradient(135deg, #030712 0%, #07111F 50%, #030712 100%)",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Aurora */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-18%",
          background:
            "conic-gradient(from 120deg at 50% 50%, transparent 0 18%, rgba(0,245,255,0.08), transparent 35% 58%, rgba(139,92,246,0.08), transparent 80% 100%)",
          filter: "blur(60px) saturate(1.15)",
          opacity: 0.45,
          animation: "singularity-aurora 18s ease-in-out infinite alternate",
          zIndex: 1,
        }}
      />

      {/* Grain grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.07,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 78%)",
          zIndex: 2,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0 30%, rgba(0,0,0,0.20) 64%, rgba(0,0,0,0.74) 100%)",
          zIndex: 3,
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 2px, transparent 7px)",
          mixBlendMode: "screen",
          zIndex: 4,
        }}
      />

      <style>{`
        @keyframes singularity-aurora {
          from { transform: translate3d(-1.5%, -1%, 0) rotate(-2deg) scale(1); }
          to   { transform: translate3d(1.8%, 1.2%, 0) rotate(3deg) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="singularity-aurora"] { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
    </div>
  );
}
