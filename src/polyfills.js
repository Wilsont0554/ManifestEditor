if (typeof globalThis.global === "undefined") {
  globalThis.global = globalThis;
}

if (typeof globalThis.setImmediate !== "function") {
  globalThis.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

if (typeof globalThis.global.setImmediate !== "function") {
  globalThis.global.setImmediate = globalThis.setImmediate;
}
