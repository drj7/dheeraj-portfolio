import { render, screen, fireEvent } from "@/test/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NotFound from "./NotFound";

// Store the mock setLocation function
let mockSetLocation: ReturnType<typeof vi.fn>;

// Mock wouter useLocation hook
vi.mock("wouter", () => ({
  useLocation: () => {
    return ["", mockSetLocation];
  },
}));

describe("NotFound", () => {
  beforeEach(() => {
    mockSetLocation = vi.fn();
  });

  describe("Rendering", () => {
    it("renders the 404 error page", () => {
      render(<NotFound />);
      expect(screen.getByText("404_ERROR")).toBeInTheDocument();
    });

    it("displays Windows fatal exception header", () => {
      render(<NotFound />);
      expect(screen.getByText("WINDOWS_FATAL_EXCEPTION")).toBeInTheDocument();
    });

    it("displays the error message with current pathname", () => {
      render(<NotFound />);
      expect(screen.getByText(/A fatal exception 404 has occurred at/)).toBeInTheDocument();
    });

    it("displays error instructions", () => {
      render(<NotFound />);
      expect(screen.getByText(/Press any key to terminate the current application/)).toBeInTheDocument();
      expect(screen.getByText(/Press CTRL\+ALT\+DEL again to restart your computer/)).toBeInTheDocument();
    });

    it("displays humorous final instruction", () => {
      render(<NotFound />);
      expect(screen.getByText(/Actually, just click the button below to go home/)).toBeInTheDocument();
    });

    it("displays technical information", () => {
      render(<NotFound />);
      expect(screen.getByText(/STOP: 0x00000404/)).toBeInTheDocument();
    });

    it("displays blinking cursor prompt", () => {
      render(<NotFound />);
      expect(screen.getByText("Press any key to continue _")).toBeInTheDocument();
    });

    it("renders return to safety button", () => {
      render(<NotFound />);
      expect(screen.getByRole("button", { name: "RETURN_TO_SAFETY" })).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to home when button is clicked", () => {
      render(<NotFound />);
      fireEvent.click(screen.getByRole("button", { name: "RETURN_TO_SAFETY" }));

      expect(mockSetLocation).toHaveBeenCalledWith("/");
    });
  });

  describe("Styling", () => {
    it("has blue screen of death styling", () => {
      const { container } = render(<NotFound />);
      const mainDiv = container.firstChild;

      expect(mainDiv).toHaveClass("bg-[#0000AA]");
      expect(mainDiv).toHaveClass("text-white");
      expect(mainDiv).toHaveClass("font-mono");
    });

    it("has full screen height", () => {
      const { container } = render(<NotFound />);
      expect(container.firstChild).toHaveClass("min-h-screen");
    });
  });
});
