/**
 * Contact Drawer Helper Utilities
 */
export function shouldOpenContactDrawer(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes("contact") || lower.includes("drawer") || lower === "#contact";
}

export function openContactDrawer(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("openContactDrawer"));
  }
}
