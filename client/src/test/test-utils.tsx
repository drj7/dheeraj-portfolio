import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";

function AllTheProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>;
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
