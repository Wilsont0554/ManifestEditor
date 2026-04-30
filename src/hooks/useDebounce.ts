import { useRef, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import type { DebouncedFunc } from "lodash.debounce";

/**
 * @param fn - the callback or function you want to debounce
 * @param delay - the delay in ms
 * @returns debounced version of the function that fired after delay
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): DebouncedFunc<T> {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  /**
   * debounced version of the callback that fired after delay
   */
  const debounced = useMemo(
    () =>
      debounce((...args: Parameters<T>) => {
        return fnRef.current(...args);
      }, delay),
    [delay],
  ) as DebouncedFunc<T>;

  //the last callback is executed on unmount
  useEffect(() => {
    return () => debounced.flush();
  }, [debounced]);

  return debounced;
}
