import { render, screen, fireEvent, waitFor } from "@/test/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Terminal } from "./Terminal";

// Mock fetch for API calls
global.fetch = vi.fn();

describe("Terminal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          response: "Test response from AI",
          suggestions: ["Follow up 1", "Follow up 2", "Follow up 3"],
        }),
    });
  });

  describe("Rendering", () => {
    it("renders the terminal container", () => {
      render(<Terminal />);
      expect(screen.getAllByText("dheeraj-ai")[0]).toBeInTheDocument();
    });

    it("renders the initial system message", () => {
      render(<Terminal />);
      expect(
        screen.getByText("dheeraj-ai • powered by gemini")
      ).toBeInTheDocument();
    });

    it("renders the initial assistant greeting", () => {
      render(<Terminal />);
      expect(
        screen.getByText(
          /Hey! I'm Dheeraj's AI assistant. Ask me anything about his background, skills, or experience./
        )
      ).toBeInTheDocument();
    });

    it("renders input field with correct placeholder", () => {
      render(<Terminal />);
      expect(
        screen.getByPlaceholderText("Ask about Dheeraj...")
      ).toBeInTheDocument();
    });

    it("renders suggested prompts", () => {
      render(<Terminal />);
      expect(screen.getByText("Who is Dheeraj?")).toBeInTheDocument();
      expect(screen.getByText("What are his skills?")).toBeInTheDocument();
      expect(
        screen.getByText("Tell me about his experience")
      ).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<Terminal className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("User Input", () => {
    it("allows typing in the input field", () => {
      render(<Terminal />);
      const input = screen.getByPlaceholderText("Ask about Dheeraj...");
      fireEvent.change(input, { target: { value: "Hello" } });
      expect(input).toHaveValue("Hello");
    });

    it("submits message on form submit", async () => {
      render(<Terminal />);
      const input = screen.getByPlaceholderText("Ask about Dheeraj...");
      fireEvent.change(input, { target: { value: "Test question" } });

      const form = input.closest("form")!;
      fireEvent.submit(form);

      expect(global.fetch).toHaveBeenCalledWith("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("Test question"),
      });
    });

    it("clears input after submitting", async () => {
      render(<Terminal />);
      const input = screen.getByPlaceholderText("Ask about Dheeraj...");
      fireEvent.change(input, { target: { value: "Test question" } });

      const form = input.closest("form")!;
      fireEvent.submit(form);

      expect(input).toHaveValue("");
    });

    it("does not submit empty messages", () => {
      render(<Terminal />);
      const input = screen.getByPlaceholderText("Ask about Dheeraj...");

      const form = input.closest("form")!;
      fireEvent.submit(form);

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("Suggested Prompts", () => {
    it("sends message when prompt is clicked", () => {
      render(<Terminal />);
      fireEvent.click(screen.getByText("Who is Dheeraj?"));

      expect(global.fetch).toHaveBeenCalledWith("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("Who is Dheeraj?"),
      });
    });

    it("updates suggestions after receiving response", async () => {
      render(<Terminal />);
      fireEvent.click(screen.getByText("Who is Dheeraj?"));

      await waitFor(() => {
        expect(screen.getByText("Follow up 1")).toBeInTheDocument();
        expect(screen.getByText("Follow up 2")).toBeInTheDocument();
        expect(screen.getByText("Follow up 3")).toBeInTheDocument();
      });
    });
  });

  describe("Message Display", () => {
    it("displays user messages", async () => {
      render(<Terminal />);
      const input = screen.getByPlaceholderText("Ask about Dheeraj...");
      fireEvent.change(input, { target: { value: "Test message" } });

      const form = input.closest("form")!;
      fireEvent.submit(form);

      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("shows typing indicator while waiting for response", async () => {
      // Make fetch hang
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(() => {})
      );

      render(<Terminal />);
      fireEvent.click(screen.getByText("Who is Dheeraj?"));

      // Check for typing indicator (three dots)
      expect(screen.getAllByText("•").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Clear Chat", () => {
    it("shows clear chat button after conversation", async () => {
      render(<Terminal />);
      const input = screen.getByPlaceholderText("Ask about Dheeraj...");
      fireEvent.change(input, { target: { value: "Test" } });

      const form = input.closest("form")!;
      fireEvent.submit(form);

      // Wait for response to complete
      await waitFor(() => {
        expect(screen.getByText("clear chat")).toBeInTheDocument();
      });
    });

    it("resets chat when clear button is clicked", async () => {
      render(<Terminal />);
      const input = screen.getByPlaceholderText("Ask about Dheeraj...");
      fireEvent.change(input, { target: { value: "Test" } });

      const form = input.closest("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText("clear chat")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("clear chat"));

      // Should be back to initial state
      expect(screen.queryByText("Test")).not.toBeInTheDocument();
      expect(screen.getByText("Who is Dheeraj?")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("shows error message on API failure", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
      });

      render(<Terminal />);
      fireEvent.click(screen.getByText("Who is Dheeraj?"));

      await waitFor(() => {
        expect(
          screen.getByText(
            /Oops, something went wrong. Try again or reach out directly/
          )
        ).toBeInTheDocument();
      });
    });
  });
});
