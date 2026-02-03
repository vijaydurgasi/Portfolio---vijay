import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ThemeToggle from "../../src/Components/ThemeToggle";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

describe("ThemeToggle component", () => {
    test("renders theme toggle button", () => {
        render(<ThemeToggle isDark={false} setIsDark={() => { }} />);

        const toggleButton = screen.getByText(/switch to dark/i);
        expect(toggleButton).toBeInTheDocument();
    });
});
test("calls setIsDark when toggle button is clicked", async () => {
    const setIsDarkMock = vi.fn();

    render(<ThemeToggle isDark={false} setIsDark={setIsDarkMock} />);

    const toggleButton = screen.getByText(/switch to dark/i);

    await userEvent.click(toggleButton);

    expect(setIsDarkMock).toHaveBeenCalledTimes(1);
});

