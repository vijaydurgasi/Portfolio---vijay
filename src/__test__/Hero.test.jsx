import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Hero from "../../src/Components/Hero";

describe("Hero View Projects button", () => {
    test("clicking View Projects triggers project scroll logic", async () => {
        const setHighlightProjectMock = vi.fn();

        const projectRef = {
            current: {
                getBoundingClientRect: vi.fn(() => ({ top: 200 })),
            },
        };

        const scrollToMock = vi.fn();
        window.scrollTo = scrollToMock;

        render(
            <Hero
                heroData={{
                    name: "Vijay",
                    role: "Frontend Developer",
                    intro: "Test intro",
                    image: "",
                }}
                setHighlightProject={setHighlightProjectMock}
                projectRef={projectRef}
            />
        );

        const projectButton = screen.getByRole("button", {
            name: /view projects/i,
        });

        await userEvent.click(projectButton);

        expect(setHighlightProjectMock).toHaveBeenCalledTimes(1);
        expect(scrollToMock).toHaveBeenCalled();
    });
});
