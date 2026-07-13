import { complex, add, subtract, multiply, divide, pow, sqrt, conj, abs, arg, exp, log, sin, cos, type Complex } from 'mathjs';
import type { ComplexValue, ReflectAxis } from '@/types';

export type MathComplex = Complex;

/** Builds a math.js Complex from a plain {re, im} value. */
export function toComplex(v: ComplexValue): MathComplex {
  return complex(v.re, v.im);
}

export function fromComplex(z: MathComplex): ComplexValue {
  return { re: z.re, im: z.im };
}

/**
 * Parses user-entered strings like "3+4i", "-2-5i", "4i", "i", "3", "3+4j"
 * into a ComplexValue. Throws a descriptive Error on invalid input.
 */
export function parseComplexInput(raw: string): ComplexValue {
  if (raw === null || raw === undefined) throw new Error('Please enter a complex number.');
  let s = raw.trim();
  if (s === '') throw new Error('Please enter a complex number.');
  s = s.replace(/\s+/g, '').replace(/j/gi, 'i').replace(/−/g, '-');

  // Pure real
  if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) {
    return { re: parseFloat(s), im: 0 };
  }

  // Pure imaginary: "4i", "-i", "i"
  if (/^[-+]?(\d+\.?\d*|\.\d+)?i$/i.test(s)) {
    let coef = s.replace(/i$/i, '');
    if (coef === '' || coef === '+') coef = '1';
    else if (coef === '-') coef = '-1';
    return { re: 0, im: parseFloat(coef) };
  }

  // Full form a+bi / a-bi
  const m = s.match(/^([-+]?(?:\d+\.?\d*|\.\d+))([-+](?:\d+\.?\d*|\.\d+)?)i$/i);
  if (m) {
    const re = parseFloat(m[1]);
    let imStr = m[2];
    if (imStr === '+') imStr = '1';
    else if (imStr === '-') imStr = '-1';
    return { re, im: parseFloat(imStr) };
  }

  throw new Error(`"${raw}" is not a valid complex number. Try a format like 3+4i.`);
}

export function formatComplex(v: ComplexValue, precision = 4): string {
  const re = trim(v.re, precision);
  const im = trim(Math.abs(v.im), precision);
  if (v.im === 0) return `${re}`;
  if (v.re === 0) return `${v.im < 0 ? '-' : ''}${im}i`;
  return `${re} ${v.im < 0 ? '-' : '+'} ${im}i`;
}

export function formatPolar(v: ComplexValue, precision = 4): string {
  const r = trim(magnitude(v), precision);
  const deg = trim(argumentDeg(v), precision);
  return `${r}(cos ${deg}° + i·sin ${deg}°)`;
}

export function formatExponential(v: ComplexValue, precision = 4): string {
  const r = trim(magnitude(v), precision);
  const rad = trim(argumentRad(v), precision);
  return `${r}·e^(i·${rad})`;
}

export function formatTrig(v: ComplexValue, precision = 4): string {
  const r = trim(magnitude(v), precision);
  const deg = trim(argumentDeg(v), precision);
  return `${r}·cis(${deg}°)`;
}

function trim(n: number, precision = 4): string {
  if (!Number.isFinite(n)) return n > 0 ? '∞' : '-∞';
  return Number(n.toFixed(precision)).toString();
}

/* ---------------- Core calculations (delegated to math.js) ---------------- */

export function magnitude(v: ComplexValue): number {
  return abs(toComplex(v)) as unknown as number;
}

export function argumentRad(v: ComplexValue): number {
  return arg(toComplex(v));
}

export function argumentDeg(v: ComplexValue): number {
  return (argumentRad(v) * 180) / Math.PI;
}

export function conjugate(v: ComplexValue): ComplexValue {
  return fromComplex(conj(toComplex(v)) as MathComplex);
}

export function reciprocal(v: ComplexValue): ComplexValue {
  if (v.re === 0 && v.im === 0) throw new Error('Cannot invert zero (1/0 is undefined).');
  return fromComplex(divide(complex(1, 0), toComplex(v)) as MathComplex);
}

export function addC(a: ComplexValue, b: ComplexValue): ComplexValue {
  return fromComplex(add(toComplex(a), toComplex(b)) as MathComplex);
}
export function subC(a: ComplexValue, b: ComplexValue): ComplexValue {
  return fromComplex(subtract(toComplex(a), toComplex(b)) as MathComplex);
}
export function mulC(a: ComplexValue, b: ComplexValue): ComplexValue {
  return fromComplex(multiply(toComplex(a), toComplex(b)) as MathComplex);
}
export function divC(a: ComplexValue, b: ComplexValue): ComplexValue {
  if (b.re === 0 && b.im === 0) throw new Error('Division by zero: z₂ = 0 + 0i.');
  return fromComplex(divide(toComplex(a), toComplex(b)) as MathComplex);
}
export function powC(a: ComplexValue, n: number): ComplexValue {
  if (a.re === 0 && a.im === 0) return n === 0 ? { re: 1, im: 0 } : { re: 0, im: 0 };
  return fromComplex(pow(toComplex(a), n) as MathComplex);
}
export function sqrtC(a: ComplexValue): ComplexValue {
  return fromComplex(sqrt(toComplex(a)) as MathComplex);
}
export function expC(a: ComplexValue): ComplexValue {
  return fromComplex(exp(toComplex(a)) as MathComplex);
}
export function logC(a: ComplexValue): ComplexValue {
  if (a.re === 0 && a.im === 0) throw new Error('log(0) is undefined.');
  return fromComplex(log(toComplex(a)) as MathComplex);
}
export function sinC(a: ComplexValue): ComplexValue {
  return fromComplex(sin(toComplex(a)) as MathComplex);
}
export function cosC(a: ComplexValue): ComplexValue {
  return fromComplex(cos(toComplex(a)) as MathComplex);
}

/* ---------------- Transformations ---------------- */

export function translate(v: ComplexValue, delta: ComplexValue): ComplexValue {
  return addC(v, delta);
}

export function rotate(v: ComplexValue, degrees: number): ComplexValue {
  const rad = (degrees * Math.PI) / 180;
  return mulC(v, { re: Math.cos(rad), im: Math.sin(rad) });
}

export function scale(v: ComplexValue, factor: number): ComplexValue {
  return { re: v.re * factor, im: v.im * factor };
}

export function reflect(v: ComplexValue, axis: ReflectAxis): ComplexValue {
  if (axis === 'real') return { re: v.re, im: -v.im };
  if (axis === 'imaginary') return { re: -v.re, im: v.im };
  return { re: -v.re, im: -v.im };
}

/* ---------------- Möbius transform: w = (az + b) / (cz + d) ---------------- */

export function mobiusTransform(
  z: ComplexValue,
  a: ComplexValue,
  b: ComplexValue,
  c: ComplexValue,
  d: ComplexValue
): ComplexValue {
  const numerator = addC(mulC(a, z), b);
  const denominator = addC(mulC(c, z), d);
  if (denominator.re === 0 && denominator.im === 0) {
    throw new Error('Undefined: pole at cz + d = 0.');
  }
  return divC(numerator, denominator);
}

export function isDegenerateMobius(a: ComplexValue, b: ComplexValue, c: ComplexValue, d: ComplexValue): boolean {
  const det = subC(mulC(a, d), mulC(b, c));
  return Math.abs(det.re) < 1e-12 && Math.abs(det.im) < 1e-12;
}

export const FUNCTION_DEFS = {
  square: { label: 'z²', fn: (z: ComplexValue) => powC(z, 2) },
  cube: { label: 'z³', fn: (z: ComplexValue) => powC(z, 3) },
  inverse: { label: '1/z', fn: (z: ComplexValue) => reciprocal(z) },
  exp: { label: 'exp(z)', fn: (z: ComplexValue) => expC(z) },
  sin: { label: 'sin(z)', fn: (z: ComplexValue) => sinC(z) },
  cos: { label: 'cos(z)', fn: (z: ComplexValue) => cosC(z) },
  log: { label: 'log(z)', fn: (z: ComplexValue) => logC(z) },
} as const;

export type FunctionKey = keyof typeof FUNCTION_DEFS;
