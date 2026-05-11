import { describe, expect, it } from "vitest";
import { extractGistId } from "@/utils/import";

describe("extractGistId", () => {
  it("parses a raw gist id", () => {
    expect(extractGistId("1234567890abcdef1234")).toBe("1234567890abcdef1234");
  });

  it("parses gist.github.com URLs", () => {
    expect(extractGistId("https://gist.github.com/example-user/1234567890abcdef1234")).toBe(
      "1234567890abcdef1234",
    );
  });

  it("parses gist.githubusercontent.com URLs", () => {
    expect(
      extractGistId(
        "https://gist.githubusercontent.com/example-user/1234567890abcdef1234/raw/some-file.json",
      ),
    ).toBe("1234567890abcdef1234");
  });

  it("returns null for invalid values", () => {
    expect(extractGistId("")).toBeNull();
    expect(extractGistId("not-a-gist")).toBeNull();
    expect(extractGistId("https://example.com/nope")).toBeNull();
  });

  it("trims whitespace before parsing", () => {
    expect(extractGistId("  1234567890abcdef1234  ")).toBe("1234567890abcdef1234");
  });

  it("returns null for a whitespace-only string", () => {
    expect(extractGistId("   ")).toBeNull();
  });

  it("returns null for gist.github.com URL with only one path segment", () => {
    expect(extractGistId("https://gist.github.com/username-only")).toBeNull();
  });

  it("parses uppercase hex gist id", () => {
    expect(extractGistId("ABCDEF1234567890ABCD")).toBe("ABCDEF1234567890ABCD");
  });
});
