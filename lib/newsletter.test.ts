import { describe, expect, it } from "vitest";
import { buildWeeklyHtml } from "./newsletter";

describe("weekly newsletter HTML", () => {
  it("escapes content and rejects unsafe links", () => {
    const html = buildWeeklyHtml({
      name: '<script>alert("x")</script>',
      deals: [
        {
          title: '<img src=x onerror="alert(1)">',
          description: "Deal & save",
          url: "javascript:alert(1)",
          image: "data:text/html,test",
        },
      ],
      tip: { title: "Tip", text: "Text", url: "javascript:alert(1)" },
      tool: { title: "Tool", text: "Text", url: "data:text/html,test" },
      unsubUrl: "javascript:alert(1)",
    });

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("data:text/html");
    expect(html).not.toContain('<script>alert("x")</script>');
    expect(html).not.toContain('<img src=x onerror="alert(1)">');
    expect(html).toContain("Deal &amp; save");
    expect(html).toContain('href="https://www.lobbium.com/deals"');
    expect(html).toContain('href="https://www.lobbium.com/newsletter"');
  });
});
