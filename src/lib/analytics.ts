// No data is sent anywhere. Connect a consent-aware analytics listener when ready.
export function track(name: string, detail: Record<string, string> = {}) {
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("portfolio:analytics", { detail: { name, ...detail } }),
    );
}
