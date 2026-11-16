import { describe, expect, test } from "vitest";
import { limitResponseLines } from "../Components/ai/ragEngine";

async function collect(stream) {
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return chunks.join("");
}

describe("RAG response limits", () => {
    test("stops streamed answers after four lines", async () => {
        const source = (async function* () {
            yield "Line one\nLine two\n";
            yield "Line three\nLine four\nLine five";
        })();

        await expect(collect(limitResponseLines(source))).resolves.toBe(
            "Line one\nLine two\nLine three\nLine four"
        );
    });
});