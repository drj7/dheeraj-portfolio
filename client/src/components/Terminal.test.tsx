import { render, screen, fireEvent } from "@/test/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Terminal } from "./Terminal";

describe("Terminal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the terminal container", () => {
      render(<Terminal />);
      expect(screen.getByRole("log")).toBeInTheDocument();
    });

    it("renders the terminal header with window controls", () => {
      render(<Terminal />);
      expect(screen.getByText("user@dheeraj-pc:~")).toBeInTheDocument();
    });

    it("renders input field with correct placeholder", () => {
      render(<Terminal />);
      expect(screen.getByPlaceholderText("Type 'help'...")).toBeInTheDocument();
    });

    it("renders quick command buttons", () => {
      render(<Terminal />);
      expect(screen.getByRole("button", { name: "[help]" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "[about]" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "[skills]" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "[contact]" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "[clear]" })).toBeInTheDocument();
    });

    it("renders with initial lines", () => {
      const initialLines = ["Line 1", "Line 2"];
      render(<Terminal initialLines={initialLines} />);
      expect(screen.getByText("Line 1")).toBeInTheDocument();
      expect(screen.getByText("Line 2")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<Terminal className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Help Command", () => {
    it("displays help message when 'help' is entered", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "help" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByText("Available commands:")).toBeInTheDocument();
      expect(screen.getByText(/help\s+- Show this help message/)).toBeInTheDocument();
    });

    it("displays help when help button is clicked", () => {
      render(<Terminal />);
      fireEvent.click(screen.getByRole("button", { name: "[help]" }));

      expect(screen.getByText("Available commands:")).toBeInTheDocument();
    });
  });

  describe("About Command", () => {
    it("displays about information when 'about' is entered", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "about" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByText("Dheeraj Yadla:")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer turned AI Whisperer.")).toBeInTheDocument();
    });

    it("displays about when about button is clicked", () => {
      render(<Terminal />);
      fireEvent.click(screen.getByRole("button", { name: "[about]" }));

      expect(screen.getByText("Dheeraj Yadla:")).toBeInTheDocument();
    });
  });

  describe("Skills Command", () => {
    it("displays skills information when 'skills' is entered", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "skills" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByText("Technical Capabilities:")).toBeInTheDocument();
      expect(screen.getByText(/\[Frontend\]\s+React, TypeScript, Tailwind/)).toBeInTheDocument();
    });

    it("displays skills when skills button is clicked", () => {
      render(<Terminal />);
      fireEvent.click(screen.getByRole("button", { name: "[skills]" }));

      expect(screen.getByText("Technical Capabilities:")).toBeInTheDocument();
    });
  });

  describe("Contact Command", () => {
    it("displays contact information when 'contact' is entered", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "contact" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByText("Contact Information:")).toBeInTheDocument();
      expect(screen.getByText("Email: dheerajyadla@gmail.com")).toBeInTheDocument();
    });

    it("displays contact when contact button is clicked", () => {
      render(<Terminal />);
      fireEvent.click(screen.getByRole("button", { name: "[contact]" }));

      expect(screen.getByText("Contact Information:")).toBeInTheDocument();
    });
  });

  describe("Clear Command", () => {
    it("clears all lines when 'clear' is entered", () => {
      render(<Terminal initialLines={["Test line"]} />);
      expect(screen.getByText("Test line")).toBeInTheDocument();

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "clear" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.queryByText("Test line")).not.toBeInTheDocument();
    });

    it("clears when clear button is clicked", () => {
      render(<Terminal initialLines={["Test line"]} />);
      fireEvent.click(screen.getByRole("button", { name: "[clear]" }));

      expect(screen.queryByText("Test line")).not.toBeInTheDocument();
    });
  });

  describe("Unknown Command", () => {
    it("displays error message for unknown commands", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "unknown" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByText("Command not found: unknown. Type 'help' for available commands.")).toBeInTheDocument();
    });
  });

  describe("Command History Navigation", () => {
    it("navigates up through command history", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");

      // Enter some commands
      fireEvent.change(input, { target: { value: "help" } });
      fireEvent.keyDown(input, { key: "Enter" });
      fireEvent.change(input, { target: { value: "about" } });
      fireEvent.keyDown(input, { key: "Enter" });

      // Navigate up
      fireEvent.keyDown(input, { key: "ArrowUp" });
      expect(input).toHaveValue("about");

      fireEvent.keyDown(input, { key: "ArrowUp" });
      expect(input).toHaveValue("help");
    });

    it("navigates down through command history", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");

      // Enter some commands
      fireEvent.change(input, { target: { value: "help" } });
      fireEvent.keyDown(input, { key: "Enter" });
      fireEvent.change(input, { target: { value: "about" } });
      fireEvent.keyDown(input, { key: "Enter" });

      // Navigate up then down
      fireEvent.keyDown(input, { key: "ArrowUp" });
      fireEvent.keyDown(input, { key: "ArrowUp" });
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(input).toHaveValue("about");
    });

    it("clears input when navigating past end of history", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "help" } });
      fireEvent.keyDown(input, { key: "Enter" });

      fireEvent.keyDown(input, { key: "ArrowUp" });
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(input).toHaveValue("");
    });

    it("does not navigate when history is empty", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.keyDown(input, { key: "ArrowUp" });
      expect(input).toHaveValue("test");
    });
  });

  describe("Case Insensitivity", () => {
    it("handles uppercase commands", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "HELP" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByText("Available commands:")).toBeInTheDocument();
    });

    it("handles mixed case commands", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "HeLp" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByText("Available commands:")).toBeInTheDocument();
    });
  });

  describe("Empty Command", () => {
    it("does not add error for empty command", () => {
      render(<Terminal />);
      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.queryByText(/Command not found/)).not.toBeInTheDocument();
    });
  });
});
