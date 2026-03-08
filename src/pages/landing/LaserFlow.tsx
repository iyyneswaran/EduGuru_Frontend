import { useRef, useEffect, useCallback } from 'react';

interface LaserFlowProps {
    color?: string;
    wispDensity?: number;
    flowSpeed?: number;
    verticalSizing?: number;
    horizontalSizing?: number;
    fogIntensity?: number;
    fogScale?: number;
    wispSpeed?: number;
    wispIntensity?: number;
    flowStrength?: number;
    decay?: number;
    horizontalBeamOffset?: number;
    verticalBeamOffset?: number;
}

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color;
uniform float u_wispDensity;
uniform float u_flowSpeed;
uniform float u_verticalSizing;
uniform float u_horizontalSizing;
uniform float u_fogIntensity;
uniform float u_fogScale;
uniform float u_wispSpeed;
uniform float u_wispIntensity;
uniform float u_flowStrength;
uniform float u_decay;
uniform float u_horizontalBeamOffset;
uniform float u_verticalBeamOffset;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 centered = uv - vec2(0.5 + u_horizontalBeamOffset, 0.5 + u_verticalBeamOffset);
  
  // Aspect ratio correction
  centered.x *= u_resolution.x / u_resolution.y;
  
  // Flow distortion
  float flow = fbm(vec2(uv.x * u_horizontalSizing * 3.0, uv.y * u_verticalSizing * 2.0) + u_time * u_flowSpeed);
  centered += (flow - 0.5) * u_flowStrength;
  
  // Laser beams - multiple horizontal bands with noise
  float beam = 0.0;
  for (float i = 0.0; i < 5.0; i++) {
    float offset = (i - 2.0) * 0.08 * u_wispDensity;
    float y = centered.y + offset;
    float wispNoise = fbm(vec2(uv.x * 4.0 + i * 10.0, u_time * u_wispSpeed * 0.1 + i));
    y += (wispNoise - 0.5) * 0.15 * u_wispIntensity * 0.2;
    
    float thickness = 0.015 + wispNoise * 0.01;
    float b = exp(-y * y / (thickness * thickness)) * (0.5 + wispNoise * 0.5);
    beam += b;
  }
  
  beam = pow(beam, u_decay);
  
  // Fog effect
  float fog = fbm(uv * u_fogScale * 5.0 + u_time * 0.05) * u_fogIntensity;
  
  // Color composition
  vec3 col = u_color * beam * 2.0;
  col += u_color * fog * 0.3;
  
  // Glow
  col += u_color * exp(-length(centered) * 2.0) * 0.15;
  
  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.8;
  col *= vignette;
  
  gl_FragColor = vec4(col, 1.0);
}
`;

const LaserFlow = ({
    color = '#7a7fff',
    wispDensity = 1,
    flowSpeed = 0.35,
    verticalSizing = 2,
    horizontalSizing = 0.5,
    fogIntensity = 0.45,
    fogScale = 0.3,
    wispSpeed = 15,
    wispIntensity = 5,
    flowStrength = 0.25,
    decay = 1.1,
    horizontalBeamOffset = 0,
    verticalBeamOffset = -0.5,
}: LaserFlowProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);

    // Parse hex color to RGB (0-1)
    const parseColor = useCallback((hex: string): [number, number, number] => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', {
            alpha: true,
            premultipliedAlpha: false,
            antialias: true,
        });
        if (!gl) return;
        glRef.current = gl;

        // Compile shaders
        const compileShader = (source: string, type: number): WebGLShader | null => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        programRef.current = program;
        gl.useProgram(program);

        // Create fullscreen quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        const positionLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        // Resize
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        // Animation loop
        const startTime = performance.now();
        const [cr, cg, cb] = parseColor(color);

        const animate = () => {
            const time = (performance.now() - startTime) / 1000;
            const program = programRef.current;
            if (!program) return;

            gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
            gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
            gl.uniform3f(gl.getUniformLocation(program, 'u_color'), cr, cg, cb);
            gl.uniform1f(gl.getUniformLocation(program, 'u_wispDensity'), wispDensity);
            gl.uniform1f(gl.getUniformLocation(program, 'u_flowSpeed'), flowSpeed);
            gl.uniform1f(gl.getUniformLocation(program, 'u_verticalSizing'), verticalSizing);
            gl.uniform1f(gl.getUniformLocation(program, 'u_horizontalSizing'), horizontalSizing);
            gl.uniform1f(gl.getUniformLocation(program, 'u_fogIntensity'), fogIntensity);
            gl.uniform1f(gl.getUniformLocation(program, 'u_fogScale'), fogScale);
            gl.uniform1f(gl.getUniformLocation(program, 'u_wispSpeed'), wispSpeed);
            gl.uniform1f(gl.getUniformLocation(program, 'u_wispIntensity'), wispIntensity);
            gl.uniform1f(gl.getUniformLocation(program, 'u_flowStrength'), flowStrength);
            gl.uniform1f(gl.getUniformLocation(program, 'u_decay'), decay);
            gl.uniform1f(gl.getUniformLocation(program, 'u_horizontalBeamOffset'), horizontalBeamOffset);
            gl.uniform1f(gl.getUniformLocation(program, 'u_verticalBeamOffset'), verticalBeamOffset);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [color, wispDensity, flowSpeed, verticalSizing, horizontalSizing, fogIntensity, fogScale, wispSpeed, wispIntensity, flowStrength, decay, horizontalBeamOffset, verticalBeamOffset, parseColor]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: 'block' }}
        />
    );
};

export default LaserFlow;
