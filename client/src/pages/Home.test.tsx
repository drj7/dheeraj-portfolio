import { render, screen, fireEvent } from "@/test/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./Home";

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Page Structure", () => {
    it("renders the main navigation", () => {
      render(<Home />);
      expect(screen.getByText("DHEERAJ_YADLA")).toBeInTheDocument();
    });

    it("renders all navigation links", () => {
      render(<Home />);
      expect(screen.getAllByText("[ ABOUT ]")[0]).toBeInTheDocument();
      expect(screen.getAllByText("[ PROJECTS ]")[0]).toBeInTheDocument();
      expect(screen.getAllByText("[ CONTACT ]")[0]).toBeInTheDocument();
    });

    it("renders the hero section", () => {
      render(<Home />);
      // Match text in h1 that might be spread across child elements
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(screen.getByText("AI_WHISPERER")).toBeInTheDocument();
    });

    it("renders the about section", () => {
      render(<Home />);
      expect(screen.getByText(/THE_TRANSFORMATION/)).toBeInTheDocument();
    });

    it("renders the projects section", () => {
      render(<Home />);
      expect(screen.getByText(/SELECTED_WORKS/)).toBeInTheDocument();
    });

    it("renders the contact section", () => {
      render(<Home />);
      expect(screen.getByText(/ESTABLISH_UPLINK/)).toBeInTheDocument();
    });
  });

  describe("Hero Section", () => {
    it("displays system status badge", () => {
      render(<Home />);
      expect(screen.getByText("SYSTEM_STATUS: ONLINE")).toBeInTheDocument();
    });

    it("displays the main tagline", () => {
      render(<Home />);
      expect(screen.getByText(/I used to write thousands of lines of code/)).toBeInTheDocument();
    });

    it("renders contact and view logs buttons", () => {
      render(<Home />);
      expect(screen.getByRole("button", { name: "INITIATE_CONTACT" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "VIEW_LOGS" })).toBeInTheDocument();
    });

    it("renders the terminal component", () => {
      render(<Home />);
      expect(screen.getByRole("log")).toBeInTheDocument();
    });
  });

  describe("About Section", () => {
    it("displays avatar image", () => {
      render(<Home />);
      const avatar = screen.getByAltText("Dheeraj Yadla");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("src", "/images/avatar.jpg");
    });

    it("displays old skills section", () => {
      render(<Home />);
      expect(screen.getByText("OLD_SKILLS")).toBeInTheDocument();
      expect(screen.getByText("Java / Spring Boot")).toBeInTheDocument();
    });

    it("displays new powers section", () => {
      render(<Home />);
      expect(screen.getByText("NEW_POWERS")).toBeInTheDocument();
      expect(screen.getByText("Prompt Engineering")).toBeInTheDocument();
    });
  });

  describe("Projects Section", () => {
    it("displays all project cards", () => {
      render(<Home />);
      expect(screen.getByText("Enterprise To-Do List")).toBeInTheDocument();
      expect(screen.getByText("The 'Scale' Social Network")).toBeInTheDocument();
      expect(screen.getByText("E-Commerce for Time Travelers")).toBeInTheDocument();
    });

    it("displays project technologies", () => {
      render(<Home />);
      expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Node.js").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    });
  });

  describe("Contact Section", () => {
    it("displays email address", () => {
      render(<Home />);
      expect(screen.getAllByText("dheerajyadla@gmail.com")[0]).toBeInTheDocument();
    });

    it("displays send email button", () => {
      render(<Home />);
      expect(screen.getByRole("button", { name: "SEND_EMAIL" })).toBeInTheDocument();
    });

    it("copies email to clipboard when copy button is clicked", async () => {
      render(<Home />);
      const copyButton = screen.getByLabelText("Copy email");
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("dheerajyadla@gmail.com");
    });

    it("opens mailto link when send email button is clicked", () => {
      delete (window as any).location;
      window.location = { href: "" } as any;

      render(<Home />);
      const sendButton = screen.getByRole("button", { name: "SEND_EMAIL" });
      fireEvent.click(sendButton);

      expect(window.location.href).toBe("mailto:dheerajyadla@gmail.com");
    });
  });

  describe("Footer", () => {
    it("renders social media links in footer", () => {
      render(<Home />);
      const footer = screen.getByText(/Built with/).parentElement;
      expect(footer).toBeInTheDocument();
    });

    it("displays copyright information", () => {
      render(<Home />);
      expect(screen.getByText(/© 2026 Dheeraj Yadla/)).toBeInTheDocument();
    });

    it("renders SystemFooter component", () => {
      render(<Home />);
      expect(screen.getByText("SYSTEM_ONLINE")).toBeInTheDocument();
    });
  });

  describe("Scroll Behavior", () => {
    it("scrolls to top on mount", () => {
      render(<Home />);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("scrolls to contact section when INITIATE_CONTACT is clicked", () => {
      render(<Home />);
      const contactButton = screen.getByRole("button", { name: "INITIATE_CONTACT" });
      fireEvent.click(contactButton);

      // scrollIntoView should be called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    it("scrolls to about section when VIEW_LOGS is clicked", () => {
      render(<Home />);
      const viewLogsButton = screen.getByRole("button", { name: "VIEW_LOGS" });
      fireEvent.click(viewLogsButton);

      // scrollIntoView should be called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });
});
