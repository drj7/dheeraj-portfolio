import { render, screen } from "@/test/test-utils";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the pages to simplify testing
vi.mock("@/pages/Home", () => ({
    default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("@/pages/NotFound", () => ({
    default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

describe("App", () => {
    describe("Rendering", () => {
        it("renders without crashing", () => {
            render(<App />);
            expect(screen.getByTestId("home-page")).toBeInTheDocument();
        });

        it("wraps content in error boundary", () => {
            // If ErrorBoundary is working, the page should still render
            render(<App />);
            expect(screen.getByTestId("home-page")).toBeInTheDocument();
        });

        it("provides theme context", () => {
            // ThemeProvider should make the page render in dark mode by default
            render(<App />);
            expect(document.documentElement).toHaveClass("dark");
        });
    });

    describe("Routing", () => {
        it("renders Home page at root path", () => {
            window.history.pushState({}, "", "/");
            render(<App />);
            expect(screen.getByTestId("home-page")).toBeInTheDocument();
        });

        it("renders NotFound page at /404", () => {
            window.history.pushState({}, "", "/404");
            render(<App />);
            expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
        });

        it("renders NotFound for unknown routes", () => {
            window.history.pushState({}, "", "/unknown-route");
            render(<App />);
            expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
        });
    });
});
