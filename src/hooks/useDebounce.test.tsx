import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebouncedCallback } from "@/hooks/useDebounce";

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedCallback", () => {
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
