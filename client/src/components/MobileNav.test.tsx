import { render, screen, fireEvent } from "@/test/test-utils";
import { describe, it, expect } from "vitest";
import { MobileNav } from "./MobileNav";

describe("MobileNav", () => {
  describe("Rendering", () => {
    it("renders the mobile menu trigger button", () => {
      render(<MobileNav />);
      expect(
        screen.getByRole("button", { name: "Open menu" })
      ).toBeInTheDocument();
    });

    it("does not render sheet content initially", () => {
      render(<MobileNav />);
      expect(screen.queryByText("MENU")).not.toBeInTheDocument();
    });
  });

  describe("Sheet Interaction", () => {
    it("opens the sheet when menu button is clicked", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      // Wait for sheet to open
      expect(await screen.findByText("MENU")).toBeInTheDocument();
    });

    it("displays all navigation links when opened", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      expect(await screen.findByText("[ ABOUT ]")).toBeInTheDocument();
      expect(screen.getByText("[ PROJECTS ]")).toBeInTheDocument();
      expect(screen.getByText("[ CONTACT ]")).toBeInTheDocument();
    });

    it("displays CONNECT section", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      expect(await screen.findByText("CONNECT")).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("has correct hrefs for navigation links", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      const aboutLink = await screen.findByRole("link", { name: "[ ABOUT ]" });
      const projectsLink = screen.getByRole("link", { name: "[ PROJECTS ]" });
      const contactLink = screen.getByRole("link", { name: "[ CONTACT ]" });

      expect(aboutLink).toHaveAttribute("href", "#about");
      expect(projectsLink).toHaveAttribute("href", "#projects");
      expect(contactLink).toHaveAttribute("href", "#contact");
    });

    it("closes sheet when a navigation link is clicked", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      const aboutLink = await screen.findByRole("link", { name: "[ ABOUT ]" });
      fireEvent.click(aboutLink);

      // Sheet should close after clicking link
      // We need to wait for the close animation
      await new Promise(resolve => setTimeout(resolve, 500));
      expect(screen.queryByText("CONNECT")).not.toBeInTheDocument();
    });
  });

  describe("Social Links", () => {
    it("renders all social media links", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      await screen.findByText("CONNECT");

      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    });

    it("has correct hrefs for social links", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      await screen.findByText("CONNECT");

      expect(screen.getByLabelText("GitHub")).toHaveAttribute(
        "href",
        "https://github.com/drj7"
      );
      expect(screen.getByLabelText("LinkedIn")).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/dheerajyadla"
      );
      expect(screen.getByLabelText("Twitter")).toHaveAttribute(
        "href",
        "https://x.com/dherj"
      );
    });

    it("opens social links in new tab", async () => {
      render(<MobileNav />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

      await screen.findByText("CONNECT");

      expect(screen.getByLabelText("GitHub")).toHaveAttribute(
        "target",
        "_blank"
      );
      expect(screen.getByLabelText("GitHub")).toHaveAttribute(
        "rel",
        "noopener noreferrer"
      );
    });
  });
});
