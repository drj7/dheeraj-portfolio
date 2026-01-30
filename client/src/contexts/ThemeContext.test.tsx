import { render, screen, act, fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

// Helper to wrap components in ThemeProvider for testing
function TestComponent() {
  const { theme, toggleTheme, switchable } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="switchable">{switchable.toString()}</span>
      {toggleTheme && (
        <button onClick={toggleTheme} data-testid="toggle">
          Toggle
        </button>
      )}
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  describe("ThemeProvider", () => {
    it("provides default light theme", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });

    it("respects defaultTheme prop", () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    it("adds dark class to document when theme is dark", () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("removes dark class when theme is light", () => {
      document.documentElement.classList.add("dark");

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  describe("Non-switchable Mode", () => {
    it("does not provide toggleTheme when not switchable", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.queryByTestId("toggle")).not.toBeInTheDocument();
    });

    it("switchable is false when not explicitly enabled", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("switchable")).toHaveTextContent("false");
    });

    it("does not persist to localStorage when not switchable", () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(localStorage.getItem("theme")).toBeNull();
    });
  });

  describe("Switchable Mode", () => {
    it("provides toggleTheme when switchable", () => {
      render(
        <ThemeProvider switchable>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("toggle")).toBeInTheDocument();
    });

    it("toggles theme from light to dark", () => {
      render(
        <ThemeProvider switchable defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("light");

      act(() => {
        fireEvent.click(screen.getByTestId("toggle"));
      });

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    it("toggles theme from dark to light", () => {
      render(
        <ThemeProvider switchable defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");

      act(() => {
        fireEvent.click(screen.getByTestId("toggle"));
      });

      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });

    it("persists theme to localStorage when switchable", () => {
      render(
        <ThemeProvider switchable defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("toggle"));
      });

      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("reads theme from localStorage when switchable", () => {
      localStorage.setItem("theme", "dark");

      render(
        <ThemeProvider switchable defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });
  });

  describe("useTheme Hook", () => {
    it("throws error when used outside ThemeProvider", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow("useTheme must be used within ThemeProvider");

      consoleError.mockRestore();
    });
  });
});
