import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePersistFn } from "./usePersistFn";

describe("usePersistFn", () => {
  describe("Stable Reference", () => {
    it("returns the same function reference across re-renders", () => {
      const fn = vi.fn();
      const { result, rerender } = renderHook(() => usePersistFn(fn));

      const firstReference = result.current;
      rerender();
      const secondReference = result.current;

      expect(firstReference).toBe(secondReference);
    });

    it("maintains stable reference when function changes", () => {
      let fn = vi.fn(() => 1);
      const { result, rerender } = renderHook(() => usePersistFn(fn));

      const firstReference = result.current;

      fn = vi.fn(() => 2);
      rerender();

      expect(result.current).toBe(firstReference);
    });
  });

  describe("Latest Function Call", () => {
    it("calls the latest version of the function", () => {
      const fn1 = vi.fn(() => "first");
      const fn2 = vi.fn(() => "second");

      const { result, rerender } = renderHook(({ fn }) => usePersistFn(fn), {
        initialProps: { fn: fn1 },
      });

      rerender({ fn: fn2 });

      const returnValue = result.current();

      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).toHaveBeenCalled();
      expect(returnValue).toBe("second");
    });

    it("passes arguments to the latest function", () => {
      const fn = vi.fn((a: number, b: number) => a + b);
      const { result } = renderHook(() => usePersistFn(fn));

      const returnValue = result.current(2, 3);

      expect(fn).toHaveBeenCalledWith(2, 3);
      expect(returnValue).toBe(5);
    });

    it("preserves 'this' context", () => {
      const obj = {
        value: 42,
        getValue: function () {
          return this.value;
        },
      };

      const { result } = renderHook(() => usePersistFn(obj.getValue));

      const boundFn = result.current.bind(obj);
      expect(boundFn()).toBe(42);
    });
  });

  describe("Edge Cases", () => {
    it("handles functions with no arguments", () => {
      const fn = vi.fn(() => "no args");
      const { result } = renderHook(() => usePersistFn(fn));

      expect(result.current()).toBe("no args");
    });

    it("handles async functions", async () => {
      const asyncFn = vi.fn(async () => "async result");
      const { result } = renderHook(() => usePersistFn(asyncFn));

      const returnValue = await result.current();

      expect(returnValue).toBe("async result");
    });

    it("handles functions that throw errors", () => {
      const throwingFn = vi.fn(() => {
        throw new Error("test error");
      });
      const { result } = renderHook(() => usePersistFn(throwingFn));

      expect(() => result.current()).toThrow("test error");
    });
  });
});
