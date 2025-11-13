"use client";

export function isAdminLoggedIn() {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("lobbiumAdminAuth");
  const loginTime = localStorage.getItem("lobbiumLoginTime");

  if (!token || !loginTime) return false;

  const now = Date.now();
  const diff = now - Number(loginTime);

  // 30 Minuten Timeout
  if (diff > 1800000) {
    localStorage.removeItem("lobbiumAdminAuth");
    localStorage.removeItem("lobbiumLoginTime");
    return false;
  }

  return true;
}