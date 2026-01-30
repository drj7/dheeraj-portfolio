import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

// Test component that throws an error
function ErrorThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>No error</div>;
}

// Error-free child component
function ChildComponent() {
  return <div>Child content</div>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("Normal Rendering", () => {
    it("renders children when there is no error", () => {
      render(
        <ErrorBoundary>
          <ChildComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("renders multiple children correctly", () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("catches errors and displays error UI", () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByText("An unexpected error occurred.")
      ).toBeInTheDocument();
    });

    it("displays the error stack trace", () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    });

    it("displays a reload button", () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByRole("button", { name: /reload page/i })
      ).toBeInTheDocument();
    });

    it("calls window.location.reload when reload button is clicked", () => {
      const reloadMock = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole("button", { name: /reload page/i }));

      expect(reloadMock).toHaveBeenCalled();
    });
  });

  describe("Static getDerivedStateFromError", () => {
    it("updates state correctly when error occurs", () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // The error UI should be visible, indicating state was updated
      expect(
        screen.getByText("An unexpected error occurred.")
      ).toBeInTheDocument();
    });
  });
});
