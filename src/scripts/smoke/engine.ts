/**
 * The hero's drifting smoke: one full-screen fragment shader (domain-warped
 * noise). This file has no DOM dependencies, so the same code runs inside a
 * Web Worker on an OffscreenCanvas, or on the main thread as a fallback.
 */

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = rot * p;
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.05;

  // The pointer gently pushes the flow field around it.
  float reach = exp(-2.6 * length(p - m));
  p += (p - m) * reach * 0.16;

  vec2 q = vec2(fbm(p * 1.35 + vec2(0.0, t)), fbm(p * 1.35 + vec2(5.2, -t * 1.3)));
  vec2 r = vec2(
    fbm(p * 1.15 + 3.2 * q + vec2(1.7, 9.2) + 0.5 * t),
    fbm(p * 1.15 + 3.2 * q + vec2(8.3, 2.8) - 0.4 * t)
  );
  float f = fbm(p * 1.05 + 2.7 * r);

  float smoke = pow(smoothstep(0.2, 0.8, f), 1.25);

  // Keep the middle of the frame dark so the headline stays readable.
  float edge = smoothstep(0.1, 0.92, length(p * vec2(0.72, 1.18)));
  float lum = smoke * mix(0.2, 1.0, edge);

  vec3 color = mix(vec3(0.016, 0.016, 0.02), vec3(0.84, 0.89, 0.98), lum);
  color += vec3(0.1, 0.34, 0.66) * pow(smoke, 3.0) * 0.4 * edge;
  color += vec3(0.95, 0.52, 0.3) * 0.045 * smoothstep(0.52, 1.0, r.x) * edge;
  color += vec3(0.32, 0.5, 0.72) * reach * 0.07;

  color *= 1.0 - 0.26 * pow(length(uv - 0.5) * 1.35, 2.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

export interface Smoke {
  /** Backing-store size in pixels. */
  resize(width: number, height: number): void;
  /** Pointer position inside the stage, 0..1 on both axes, origin bottom-left. */
  pointer(x: number, y: number): void;
  /** Start or stop the animation loop. While stopped, a still frame is kept. */
  run(active: boolean): void;
}

interface SmokeEvents {
  /** Called once the first frame has been drawn. */
  ready(): void;
  /** Called if the GPU context is lost. */
  lost(): void;
}

const nextFrame: (callback: () => void) => void =
  typeof requestAnimationFrame === 'function'
    ? (callback) => requestAnimationFrame(callback)
    : (callback) => setTimeout(callback, 16);

export function createSmoke(canvas: HTMLCanvasElement | OffscreenCanvas, events: SmokeEvents): Smoke | null {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    // No GPU means the shader would run on the CPU: keep the CSS backdrop instead.
    failIfMajorPerformanceCaveat: true,
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);

  const pointer = { x: 0.5, y: 0.5 };
  const target = { x: 0.5, y: 0.5 };
  const startedAt = performance.now();
  let uniforms: Record<'res' | 'time' | 'mouse', WebGLUniformLocation | null> | undefined;
  let active = false;
  let looping = false;
  let lost = false;
  let announced = false;

  const draw = () => {
    if (!uniforms || lost) return;
    pointer.x += (target.x - pointer.x) * 0.045;
    pointer.y += (target.y - pointer.y) * 0.045;
    gl.uniform2f(uniforms.res, canvas.width, canvas.height);
    // Start well into the simulation so the first frame is already formed.
    gl.uniform1f(uniforms.time, 60 + (performance.now() - startedAt) / 1000);
    gl.uniform2f(uniforms.mouse, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!announced) {
      announced = true;
      events.ready();
    }
  };

  const loop = () => {
    if (!active || lost) {
      looping = false;
      return;
    }
    draw();
    nextFrame(loop);
  };

  const wake = () => {
    if (looping || !active || !uniforms || lost) return;
    looping = true;
    nextFrame(loop);
  };

  // Where the browser can compile in the background, wait for it there
  // rather than stalling on the first status query.
  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  const settle = () => {
    if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
      nextFrame(settle);
      return;
    }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);
    // One oversized triangle covers the viewport.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    uniforms = {
      res: gl.getUniformLocation(program, 'u_res'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
    };
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
    wake();
  };
  settle();

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    lost = true;
    events.lost();
  });

  return {
    resize(width, height) {
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      if (!looping) draw();
    },
    pointer(x, y) {
      target.x = x;
      target.y = y;
    },
    run(next) {
      active = next;
      wake();
    },
  };
}
