import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach } from "vitest";
import ContactPage from "../../src/Components/ContactPage";

describe("ContactPage form", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({}),
                })
            )
        );
    });

    test("allows user to fill and submit the contact form", async () => {
        render(<ContactPage />);

        const nameInput = screen.getByPlaceholderText(/your name/i);
        const emailInput = screen.getByPlaceholderText(/your email/i);
        const messageInput = screen.getByPlaceholderText(/tell me about your project/i);
        const submitButton = screen.getByRole("button", { name: /send message/i });

        await userEvent.type(nameInput, "Vijay");
        await userEvent.type(emailInput, "vijay@test.com");
        await userEvent.type(messageInput, "Interested in working together");

        expect(nameInput).toHaveValue("Vijay");
        expect(emailInput).toHaveValue("vijay@test.com");
        expect(messageInput).toHaveValue("Interested in working together");

        await userEvent.click(submitButton);

        expect(fetch).toHaveBeenCalledTimes(1);


        expect(
            await screen.findByText(/message sent successfully/i)
        ).toBeInTheDocument();
    });
});
