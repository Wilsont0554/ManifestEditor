type SetImmediateHandler = (...args: unknown[]) => void;
type SetImmediate = (handler: SetImmediateHandler, ...args: unknown[]) => number;

const globalScope = globalThis as typeof globalThis & {
  global?: typeof globalThis;
};
const setImmediatePolyfill: SetImmediate = (handler, ...args) => window.setTimeout(() => handler(...args), 0);
const setImmediateTarget = globalThis as typeof globalThis & {
  setImmediate?: SetImmediate;
};

if (typeof globalScope.global === "undefined") {
  globalScope.global = globalScope;
}

if (typeof setImmediateTarget.setImmediate !== "function") {
  Object.assign(setImmediateTarget, { setImmediate: setImmediatePolyfill });
}

if (typeof (globalScope.global as typeof globalThis & { setImmediate?: SetImmediate }).setImmediate !== "function") {
  Object.assign(globalScope.global, { setImmediate: setImmediateTarget.setImmediate });
}
