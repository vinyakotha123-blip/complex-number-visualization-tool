export interface ComplexValue {
  re: number;
  im: number;
}

export interface SavedGraph {
  _id: string;
  name: string;
  re: number;
  im: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedGraphInput {
  name: string;
  re: number;
  im: number;
  color?: string;
}

export type OperationType =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'sqrt'
  | 'conjugate'
  | 'inverse';

export type TransformType = 'translate' | 'rotate' | 'scale' | 'reflect';

export type ReflectAxis = 'real' | 'imaginary' | 'origin';

export type RepresentationType = 'rectangular' | 'polar' | 'exponential' | 'trig';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  data: T;
}
