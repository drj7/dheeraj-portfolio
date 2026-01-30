import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useComposition } from "./useComposition";

describe("useComposition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initial State", () => {
    it("returns all expected handlers", () => {
      const { result } = renderHook(() => useComposition());

      expect(result.current).toHaveProperty("onCompositionStart");
      expect(result.current).toHaveProperty("onCompositionEnd");
      expect(result.current).toHaveProperty("onKeyDown");
      expect(result.current).toHaveProperty("isComposing");
    });

    it("isComposing returns false initially", () => {
      const { result } = renderHook(() => useComposition());

      expect(result.current.isComposing()).toBe(false);
    });
  });

  describe("Composition Events", () => {
    it("sets composing to true on compositionStart", () => {
      const { result } = renderHook(() => useComposition());

      act(() => {
        result.current.onCompositionStart({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      expect(result.current.isComposing()).toBe(true);
    });

    it("sets composing to false after compositionEnd with delay", () => {
      const { result } = renderHook(() => useComposition());

      act(() => {
        result.current.onCompositionStart({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      expect(result.current.isComposing()).toBe(true);

      act(() => {
        result.current.onCompositionEnd({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      // Still composing immediately after compositionEnd due to Safari fix
      expect(result.current.isComposing()).toBe(true);

      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.isComposing()).toBe(false);
    });
  });

  describe("KeyDown Handling", () => {
    it("stops propagation for Escape during composition", () => {
      const { result } = renderHook(() => useComposition());
      const stopPropagation = vi.fn();

      act(() => {
        result.current.onCompositionStart({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.onKeyDown({
          key: "Escape",
          stopPropagation,
          shiftKey: false,
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(stopPropagation).toHaveBeenCalled();
    });

    it("stops propagation for Enter during composition", () => {
      const { result } = renderHook(() => useComposition());
      const stopPropagation = vi.fn();

      act(() => {
        result.current.onCompositionStart({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.onKeyDown({
          key: "Enter",
          stopPropagation,
          shiftKey: false,
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(stopPropagation).toHaveBeenCalled();
    });

    it("allows Shift+Enter during composition", () => {
      const onKeyDown = vi.fn();
      const { result } = renderHook(() => useComposition({ onKeyDown }));
      const stopPropagation = vi.fn();

      act(() => {
        result.current.onCompositionStart({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.onKeyDown({
          key: "Enter",
          stopPropagation,
          shiftKey: true,
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(stopPropagation).not.toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();
    });

    it("calls original onKeyDown when not composing", () => {
      const onKeyDown = vi.fn();
      const { result } = renderHook(() => useComposition({ onKeyDown }));

      act(() => {
        result.current.onKeyDown({
          key: "Enter",
          stopPropagation: vi.fn(),
          shiftKey: false,
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe("Original Handlers", () => {
    it("calls original onCompositionStart", () => {
      const onCompositionStart = vi.fn();
      const { result } = renderHook(() =>
        useComposition({ onCompositionStart })
      );

      act(() => {
        result.current.onCompositionStart({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      expect(onCompositionStart).toHaveBeenCalled();
    });

    it("calls original onCompositionEnd", () => {
      const onCompositionEnd = vi.fn();
      const { result } = renderHook(() => useComposition({ onCompositionEnd }));

      act(() => {
        result.current.onCompositionEnd({
          data: "test",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      expect(onCompositionEnd).toHaveBeenCalled();
    });
  });

  describe("Timer Cleanup", () => {
    it("clears timers on new compositionStart", () => {
      const { result } = renderHook(() => useComposition());

      act(() => {
        result.current.onCompositionStart({
          data: "test1",
        } as React.CompositionEvent<HTMLInputElement>);
        result.current.onCompositionEnd({
          data: "test1",
        } as React.CompositionEvent<HTMLInputElement>);
        result.current.onCompositionStart({
          data: "test2",
        } as React.CompositionEvent<HTMLInputElement>);
      });

      // Should still be composing because we started a new composition
      expect(result.current.isComposing()).toBe(true);

      act(() => {
        vi.runAllTimers();
      });

      // Still composing because the second compositionStart should have cleared the timers
      expect(result.current.isComposing()).toBe(true);
    });
  });
});
