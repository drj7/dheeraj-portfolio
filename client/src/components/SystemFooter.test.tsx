import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SystemFooter } from "./SystemFooter";

describe("SystemFooter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders the footer container", () => {
      render(<SystemFooter />);
      expect(screen.getByText("SYSTEM_ONLINE")).toBeInTheDocument();
    });

    it("renders version number", () => {
      render(<SystemFooter />);
      expect(screen.getByText("v2.0.4")).toBeInTheDocument();
    });

    it("renders initial uptime as 00:00:00", () => {
      render(<SystemFooter />);
      expect(screen.getByText("00:00:00")).toBeInTheDocument();
    });

    it("renders initial memory value", () => {
      render(<SystemFooter />);
      expect(screen.getByText("42%")).toBeInTheDocument();
    });

    it("renders initial latency value", () => {
      render(<SystemFooter />);
      expect(screen.getByText("24ms")).toBeInTheDocument();
    });

    it("renders UPTIME label", () => {
      render(<SystemFooter />);
      expect(screen.getByText("UPTIME:")).toBeInTheDocument();
    });

    it("renders HEAP label", () => {
      render(<SystemFooter />);
      expect(screen.getByText("HEAP:")).toBeInTheDocument();
    });

    it("renders LATENCY label", () => {
      render(<SystemFooter />);
      expect(screen.getByText("LATENCY:")).toBeInTheDocument();
    });
  });

  describe("Uptime Counter", () => {
    it("increments uptime after 1 second", () => {
      render(<SystemFooter />);
      expect(screen.getByText("00:00:00")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText("00:00:01")).toBeInTheDocument();
    });

    it("increments uptime correctly over multiple seconds", () => {
      render(<SystemFooter />);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText("00:00:05")).toBeInTheDocument();
    });

    it("formats minutes correctly", () => {
      render(<SystemFooter />);

      act(() => {
        vi.advanceTimersByTime(65000); // 1 minute 5 seconds
      });

      expect(screen.getByText("00:01:05")).toBeInTheDocument();
    });

    it("formats hours correctly", () => {
      render(<SystemFooter />);

      act(() => {
        vi.advanceTimersByTime(3665000); // 1 hour 1 minute 5 seconds
      });

      expect(screen.getByText("01:01:05")).toBeInTheDocument();
    });
  });

  describe("Interval Cleanup", () => {
    it("clears interval on unmount", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      const { unmount } = render(<SystemFooter />);

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
