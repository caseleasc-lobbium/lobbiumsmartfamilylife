// Security Utilities

// Rate Limiting Store (In-Memory - für Production Redis verwenden)
const rateLimitStore = new Map();

/**
 * Rate Limiting
 * @param {string} identifier - IP oder User ID
 * @param {number} maxRequests - Max Requests pro Zeitfenster
 * @param {number} windowMs - Zeitfenster in Millisekunden
 */
export function rateLimit(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;
  
  // Alte Einträge bereinigen
  for (const [k, v] of rateLimitStore.entries()) {
    if (now - v.resetTime > windowMs) {
      rateLimitStore.delete(k);
    }
  }
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  const record = rateLimitStore.get(key);
  
  if (now > record.resetTime) {
    // Zeitfenster abgelaufen, zurücksetzen
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  record.count++;
  
  if (record.count > maxRequests) {
    return { 
      allowed: false, 
      remaining: 0,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    };
  }
  
  return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Get Client IP from Request
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : 
             request.headers.get("x-real-ip") || 
             "unknown";
  return ip;
}

/**
 * Sanitize User Input (Basic XSS Protection)
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return input;
  
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate Email Format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Admin Cookie
 */
export function validateAdminAuth(cookies) {
  const authCookie = cookies.get("lobbium_admin_auth");
  return authCookie?.value === "true";
}

/**
 * Security Headers
 */
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

/**
 * CORS Headers (Restrictive)
 */
export function getCorsHeaders(origin) {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3000",
    "https://lobbium.com"
  ].filter(Boolean);
  
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    };
  }
  
  return {};
}

/**
 * Safe Error Response (keine sensiblen Infos)
 */
export function safeErrorResponse(error, isDevelopment = false) {
  if (isDevelopment) {
    return {
      error: error.message || "Ein Fehler ist aufgetreten",
      details: error.stack
    };
  }
  
  return {
    error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
  };
}
