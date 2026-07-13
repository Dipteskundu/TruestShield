/**
 * Safe clipboard write — uses the Clipboard API when available,
 * falls back to a textarea + execCommand("copy") for insecure
 * contexts (HTTP) or older browsers where navigator.clipboard
 * is undefined.
 *
 * @returns true if the text was copied, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API (requires HTTPS or localhost)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Clipboard permission denied or write failed — fall through
    }
  }

  // Legacy fallback: hidden textarea + execCommand
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
