// Minimal build-time Node typings for src/lib/media.ts (the project does not ship @types/node).
declare module 'node:fs' { export function existsSync(path: string): boolean; }
declare module 'node:path' { export function join(...parts: string[]): string; }
