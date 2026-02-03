import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, test, expect } from "vitest";
import NaviBar from "../../src/Components/NaviBar";

describe("NaviBar Home button", () => {
    test("navigates to home page when home button is clicked", async () => {
        render(
            <MemoryRouter initialEntries={["/contact"]}>
                <Routes>
                    <Route
                        path="/"
                        element={<h1>Home Page</h1>}
                    />
                    <Route
                        path="/contact"
                        element={<NaviBar isDark={false} setIsDark={() => { }} />}
                    />
                </Routes>
            </MemoryRouter>
        );

        const homeButton = screen.getByLabelText(/go to home/i);

        await userEvent.click(homeButton);

        expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
});
