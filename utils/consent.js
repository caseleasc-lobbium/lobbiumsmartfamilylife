export function trackingAllowed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("lobbium_consent") === "accepted";
}