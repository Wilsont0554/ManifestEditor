import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebouncedCallback } from "@/hooks/useDebounce";

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedCallback", () => {
  it("multiple rapid calls fire callback only once", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("first");
      result.current("second");
      result.current("third");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("third");
  });

  it("debounces callback invocation", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 200));

    act(() => {
      result.current("value");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).toHaveBeenCalledWith("value");
  });

  it("flushes pending callback on unmount", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("pending");
    });

    expect(callback).not.toHaveBeenCalled();

    unmount();

    expect(callback).toHaveBeenCalledWith("pending");
  });
});
