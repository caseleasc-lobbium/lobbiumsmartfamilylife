import { describe, expect, it } from "vitest";
import { renderConfirmEmail, renderWelcomeEmail } from "./emailTemplates";

describe("transactional email templates", () => {
  it("escapes subscriber-controlled names", () => {
    const html = renderConfirmEmail({
      name: '<img src=x onerror="alert(1)">',
      confirmUrl: "https://www.lobbium.com/confirm",
      locale: "de",
    });

    expect(html).not.toContain('<img src=x onerror="alert(1)">');
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });

  it("replaces unsafe links with the canonical Lobbium URL", () => {
    const confirmHtml = renderConfirmEmail({
      name: "Alex",
      confirmUrl: "javascript:alert(1)",
      locale: "de",
    });
    const welcomeHtml = renderWelcomeEmail({
      name: "Alex",
      siteUrl: "javascript:alert(1)",
      unsubUrl: "data:text/html,test",
      locale: "en",
    });

    expect(confirmHtml).not.toContain("javascript:");
    expect(welcomeHtml).not.toContain("javascript:");
    expect(welcomeHtml).not.toContain("data:text/html");
    expect(welcomeHtml).toContain("https://www.lobbium.com/tools");
  });

  it("uses French copy for French subscribers", () => {
    const html = renderConfirmEmail({
      name: "Camille",
      confirmUrl: "https://www.lobbium.com/confirm",
      locale: "fr",
    });

    expect(html).toContain('lang="fr"');
    expect(html).toContain("Confirmer l'inscription");
  });
});
