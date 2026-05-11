import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import type { DebouncedFunc } from "lodash.debounce";

/**
 * @param fn - the callback or function you want to debounce
 * @param delay - the delay in ms
 * @returns debounced version of the function that fired after delay
 */
export function useDebouncedCallback<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  delay: number,
): DebouncedFunc<(...args: TArgs) => TResult> {

  /**
   * debounced version of the callback that fired after delay
   */
  const debounced = useMemo(
    () =>
      debounce((...args: TArgs) => {
        return fn(...args);
      }, delay),
    [delay, fn],
  );

  //the last callback is executed on unmount
  useEffect(() => {
    return () => debounced.flush();
  }, [debounced]);

  return debounced;
}
