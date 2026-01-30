import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  describe("Basic Class Merging", () => {
    it("handles single class string", () => {
      expect(cn("foo")).toBe("foo");
    });

    it("handles multiple class strings", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles empty strings", () => {
      expect(cn("foo", "", "bar")).toBe("foo bar");
    });

    it("handles undefined values", () => {
      expect(cn("foo", undefined, "bar")).toBe("foo bar");
    });

    it("handles null values", () => {
      expect(cn("foo", null, "bar")).toBe("foo bar");
    });

    it("handles false values", () => {
      expect(cn("foo", false, "bar")).toBe("foo bar");
    });
  });

  describe("Conditional Classes (clsx behavior)", () => {
    it("handles object with truthy values", () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    it("handles mixed strings and objects", () => {
      expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });

    it("handles arrays of classes", () => {
      expect(cn(["foo", "bar"])).toBe("foo bar");
    });

    it("handles nested arrays", () => {
      expect(cn(["foo", ["bar", "baz"]])).toBe("foo bar baz");
    });

    it("handles conditional expressions", () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn(isActive && "active", isDisabled && "disabled")).toBe("active");
    });
  });

  describe("Tailwind Merge Conflicts", () => {
    it("resolves padding conflicts", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
    });

    it("resolves margin conflicts", () => {
      expect(cn("m-4", "m-2")).toBe("m-2");
    });

    it("resolves text color conflicts", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("resolves background color conflicts", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("resolves flex direction conflicts", () => {
      expect(cn("flex-row", "flex-col")).toBe("flex-col");
    });

    it("resolves font size conflicts", () => {
      expect(cn("text-sm", "text-lg")).toBe("text-lg");
    });

    it("resolves width conflicts", () => {
      expect(cn("w-4", "w-8")).toBe("w-8");
    });

    it("resolves height conflicts", () => {
      expect(cn("h-4", "h-8")).toBe("h-8");
    });

    it("preserves non-conflicting classes", () => {
      expect(cn("p-4 text-red-500", "m-2 bg-blue-500")).toBe(
        "p-4 text-red-500 m-2 bg-blue-500"
      );
    });

    it("resolves border radius conflicts", () => {
      expect(cn("rounded-sm", "rounded-lg")).toBe("rounded-lg");
    });
  });

  describe("Complex Scenarios", () => {
    it("handles component composition pattern", () => {
      const baseClasses = "bg-white p-4 rounded";
      const variantClasses = "bg-primary p-2";
      const result = cn(baseClasses, variantClasses);
      expect(result).toBe("rounded bg-primary p-2");
    });

    it("handles responsive modifiers", () => {
      expect(cn("text-sm", "md:text-lg", "lg:text-xl")).toBe(
        "text-sm md:text-lg lg:text-xl"
      );
    });

    it("handles state modifiers", () => {
      expect(cn("bg-white", "hover:bg-gray-100", "focus:bg-gray-200")).toBe(
        "bg-white hover:bg-gray-100 focus:bg-gray-200"
      );
    });

    it("handles dark mode modifiers", () => {
      expect(cn("bg-white", "dark:bg-gray-900")).toBe(
        "bg-white dark:bg-gray-900"
      );
    });

    it("resolves conflicts within same modifier", () => {
      expect(cn("hover:bg-red-500", "hover:bg-blue-500")).toBe(
        "hover:bg-blue-500"
      );
    });

    it("handles arbitrary values", () => {
      expect(cn("top-[117px]", "top-[120px]")).toBe("top-[120px]");
    });
  });

  describe("Edge Cases", () => {
    it("returns empty string for no arguments", () => {
      expect(cn()).toBe("");
    });

    it("returns empty string for all falsy arguments", () => {
      expect(cn(null, undefined, false, "")).toBe("");
    });

    it("handles very long class lists", () => {
      const classes = Array(100)
        .fill("class")
        .map((c, i) => `${c}-${i}`);
      const result = cn(...classes);
      expect(result.split(" ").length).toBe(100);
    });

    it("preserves whitespace classes correctly", () => {
      expect(cn("  foo  ", "  bar  ")).toBe("foo bar");
    });
  });
});
