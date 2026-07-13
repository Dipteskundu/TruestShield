import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { copyToClipboard } from "../clipboard";

describe("copyToClipboard", () => {
  let originalClipboard: typeof navigator.clipboard;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  it("returns true when Clipboard API writeText succeeds", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard("hello");

    expect(result).toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("returns false when Clipboard API writeText rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard("hello");

    expect(result).toBe(false);
  });

  it("falls back to execCommand when navigator.clipboard is undefined", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    // jsdom doesn't have execCommand — define it
    (document as any).execCommand = vi.fn().mockReturnValue(true);

    const result = await copyToClipboard("fallback text");

    expect(result).toBe(true);
    expect((document as any).execCommand).toHaveBeenCalledWith("copy");

    delete (document as any).execCommand;
  });

  it("creates a hidden textarea for fallback and removes it after", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    (document as any).execCommand = vi.fn().mockReturnValue(true);
    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    await copyToClipboard("test");

    expect(appendChildSpy).toHaveBeenCalled();
    const textarea = appendChildSpy.mock.calls[0][0] as HTMLTextAreaElement;
    expect(textarea.value).toBe("test");
    expect(textarea.style.position).toBe("fixed");

    expect(removeChildSpy).toHaveBeenCalledWith(textarea);

    delete (document as any).execCommand;
  });

  it("returns false when both clipboard API and execCommand fail", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    (document as any).execCommand = vi.fn().mockImplementation(() => {
      throw new Error("not supported");
    });

    const result = await copyToClipboard("fail");

    expect(result).toBe(false);

    delete (document as any).execCommand;
  });

  it("returns false when navigator.clipboard exists but writeText is not a function", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: null },
      writable: true,
      configurable: true,
    });

    (document as any).execCommand = vi.fn().mockReturnValue(true);

    const result = await copyToClipboard("text");

    expect(result).toBe(true);

    delete (document as any).execCommand;
  });
});
