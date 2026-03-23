declare global {
  var global: typeof globalThis;
  var setImmediate: (handler: (...args: unknown[]) => void, ...args: unknown[]) => number;
}

if (typeof globalThis.global === "undefined") {
  globalThis.global = globalThis;
}

if (typeof globalThis.setImmediate !== "function") {
  globalThis.setImmediate = (handler, ...args) => window.setTimeout(() => handler(...args), 0);
}

if (typeof globalThis.global.setImmediate !== "function") {
  globalThis.global.setImmediate = globalThis.setImmediate;
}

export {};
