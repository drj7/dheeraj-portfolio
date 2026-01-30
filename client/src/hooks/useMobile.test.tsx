import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIsMobile } from "./useMobile";

describe("useIsMobile", () => {
    const originalMatchMedia = window.matchMedia;
    const originalInnerWidth = window.innerWidth;

    let mockAddEventListener: ReturnType<typeof vi.fn>;
    let mockRemoveEventListener: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockAddEventListener = vi.fn();
        mockRemoveEventListener = vi.fn();

        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: mockAddEventListener,
            removeEventListener: mockRemoveEventListener,
            dispatchEvent: vi.fn(),
        }));
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    it("returns false for desktop viewport", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
        });

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it("returns true for mobile viewport", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 500,
        });

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it("returns true at exactly 767px (below breakpoint)", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 767,
        });

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it("returns false at exactly 768px (at breakpoint)", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 768,
        });

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it("adds event listener on mount", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
        });

        renderHook(() => useIsMobile());
        expect(mockAddEventListener).toHaveBeenCalledWith(
            "change",
            expect.any(Function)
        );
    });

    it("removes event listener on unmount", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
        });

        const { unmount } = renderHook(() => useIsMobile());
        unmount();

        expect(mockRemoveEventListener).toHaveBeenCalledWith(
            "change",
            expect.any(Function)
        );
    });

    it("updates value when window size changes", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
        });

        let changeHandler: () => void = () => { };
        mockAddEventListener.mockImplementation(
            (event: string, handler: () => void) => {
                if (event === "change") changeHandler = handler;
            }
        );

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        // Simulate resize to mobile
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 500,
        });

        act(() => {
            changeHandler();
        });

        expect(result.current).toBe(true);
    });
});
