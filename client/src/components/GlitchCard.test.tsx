import { render, screen } from "@/test/test-utils";
import { describe, it, expect } from "vitest";
import { GlitchCard } from "./GlitchCard";

describe("GlitchCard", () => {
  describe("Basic Rendering", () => {
    it("renders children correctly", () => {
      render(
        <GlitchCard>
          <p>Test content</p>
        </GlitchCard>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(
        <GlitchCard title="Test Title">
          <p>Content</p>
        </GlitchCard>
      );

      expect(
        screen.getByRole("heading", { name: "Test Title" })
      ).toBeInTheDocument();
    });

    it("does not render title when not provided", () => {
      render(
        <GlitchCard>
          <p>Content</p>
        </GlitchCard>
      );

      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <GlitchCard className="custom-class">
          <p>Content</p>
        </GlitchCard>
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies default border and styling classes", () => {
      const { container } = render(
        <GlitchCard>
          <p>Content</p>
        </GlitchCard>
      );

      expect(container.firstChild).toHaveClass("border");
      expect(container.firstChild).toHaveClass("bg-card");
      expect(container.firstChild).toHaveClass("p-6");
    });
  });

  describe("Visual Elements", () => {
    it("renders corner accent elements", () => {
      const { container } = render(
        <GlitchCard>
          <p>Content</p>
        </GlitchCard>
      );

      // Check for corner accent divs (4 corners)
      const cornerElements = container.querySelectorAll(".absolute.w-2.h-2");
      expect(cornerElements.length).toBe(4);
    });

    it("renders scanline effect overlay", () => {
      const { container } = render(
        <GlitchCard>
          <p>Content</p>
        </GlitchCard>
      );

      // Check for scanline overlay (pointer-events-none div with linear gradient)
      const scanlineOverlay = container.querySelector(".pointer-events-none");
      expect(scanlineOverlay).toBeInTheDocument();
    });

    it("renders content inside z-10 container", () => {
      const { container } = render(
        <GlitchCard>
          <p>Test content</p>
        </GlitchCard>
      );

      const contentContainer = container.querySelector(".z-10");
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveTextContent("Test content");
    });
  });

  describe("Complex Children", () => {
    it("renders multiple children", () => {
      render(
        <GlitchCard title="Project">
          <p>Description</p>
          <div>
            <span>Tag 1</span>
            <span>Tag 2</span>
          </div>
        </GlitchCard>
      );

      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Tag 1")).toBeInTheDocument();
      expect(screen.getByText("Tag 2")).toBeInTheDocument();
    });
  });
});
