import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke tests for the regressions this site has actually had (see HANDOFF.md):
 * pages that render but break, overlays that won't close, links crawlers can't
 * see, WhatsApp messages that point at the wrong product.
 */

const ROUTES = [
  "/",
  "/bars",
  "/bars/oat-cookie-bar",
  "/bars/oat-protein-bar",
  "/nutrition",
  "/gifting",
  "/ordering",
  "/wholesale",
  "/about",
];

const WHATSAPP = "https://wa.me/97338366111";

/** The gifting pop-up opens 1.4s after load on most pages. Tests that aren't
    about it mark it seen up front so it can't cover what they click. */
async function suppressPromo(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("cc-gifting-promo", "1"));
}

/** Fail on uncaught errors and console errors. `next start` has no
    /_vercel/* endpoints, so the analytics and Speed Insights scripts 404
    locally — that is expected and filtered out.

    React #418 (hydration mismatch) is also let through, deliberately and
    narrowly: it is a known, pre-existing race that fires on ~1–2% of
    production loads under load, recovers invisibly, and is tracked in
    HANDOFF.md → Open items. It is recorded as an annotation so it stays
    visible in the report. Remove this exemption once that is fixed. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => {
    if (e.message.includes("Minified React error #418")) {
      test.info().annotations.push({ type: "known-issue", description: "React #418 hydration race (see HANDOFF.md)" });
      return;
    }
    errors.push(`pageerror: ${e.message}`);
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const where = m.location().url ?? "";
    if (where.includes("/_vercel/") || m.text().includes("/_vercel/")) return;
    errors.push(`console: ${m.text()}`);
  });
  return errors;
}

test.describe("every route", () => {
  for (const route of ROUTES) {
    test(`${route} renders cleanly`, async ({ page }) => {
      await suppressPromo(page);
      const errors = watchErrors(page);

      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(/Candy Couture/);
      await expect(page.locator("h1").first()).toBeVisible();

      // The footer is the crawlable path to /wholesale and /about.
      const footer = page.getByRole("navigation", { name: "Site links" });
      await expect(footer.locator('a[href="/wholesale"]')).toHaveCount(1);
      await expect(footer.locator('a[href="/about"]')).toHaveCount(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, "page scrolls horizontally").toBe(false);
      expect(errors).toEqual([]);
    });
  }

  test("unknown URLs get the branded 404", async ({ page }) => {
    await suppressPromo(page);
    const res = await page.goto("/bars/not-a-real-bar");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toBeVisible();
    // The way back out: links to the bars and home.
    await expect(page.locator("main section a[href='/']")).toHaveCount(1);
    await expect(page.locator("main section a[href='/bars']")).toHaveCount(1);
  });
});

test.describe("WhatsApp ordering", () => {
  async function whatsappMessages(page: Page) {
    const hrefs = await page
      .locator(`a[href^="${WHATSAPP}"]`)
      .evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
    return hrefs.map((h) => decodeURIComponent(h.split("?text=")[1] ?? ""));
  }

  test("product cards order the right bar", async ({ page }) => {
    await suppressPromo(page);
    await page.goto("/bars");
    const messages = await whatsappMessages(page);
    expect(messages).toContainEqual(expect.stringContaining("Oat Cookie Bar"));
    expect(messages).toContainEqual(expect.stringContaining("Oat Protein Bar"));
  });

  test("gift boxes order the right box", async ({ page }) => {
    await suppressPromo(page);
    await page.goto("/gifting");
    const messages = await whatsappMessages(page);
    expect(messages).toContainEqual(expect.stringContaining("Gift Box of 6"));
    expect(messages).toContainEqual(expect.stringContaining("Gift Box of 12"));
  });

  test("links open in a new tab", async ({ page }) => {
    await suppressPromo(page);
    await page.goto("/ordering");
    const link = page.locator(`a[href^="${WHATSAPP}"]`).first();
    await expect(link).toHaveAttribute("target", "_blank");
  });
});

test.describe("gifting pop-up", () => {
  // The dialog is named by its visible title (aria-labelledby wins over
  // aria-label), so match the title text.
  const promo = (page: Page) =>
    page.getByRole("dialog", { name: /Gifting Collection/ });

  test("shows once, closes cleanly, and stays closed for the session", async ({ page }) => {
    await page.goto("/");
    await expect(promo(page)).toBeVisible({ timeout: 6_000 });

    await page.getByRole("button", { name: "Continue browsing" }).click();
    await expect(promo(page)).toHaveCount(0);

    // Nothing is left covering the page: a real click still navigates.
    await page.getByRole("navigation", { name: "Site links" }).getByRole("link", { name: "Bars", exact: true }).click();
    await expect(page).toHaveURL(/\/bars$/);

    await page.reload();
    await page.waitForTimeout(3_000);
    await expect(promo(page)).toHaveCount(0);
  });

  test("never shows on /gifting itself", async ({ page }) => {
    await page.goto("/gifting");
    await page.waitForTimeout(3_000);
    await expect(promo(page)).toHaveCount(0);
  });

  test("Escape closes it", async ({ page }) => {
    await page.goto("/");
    await expect(promo(page)).toBeVisible({ timeout: 6_000 });
    await page.keyboard.press("Escape");
    await expect(promo(page)).toHaveCount(0);
  });
});

test.describe("overlays", () => {
  /** The menu opens from the hamburger or the bottom bar on mobile, and from
      "Menu" in the desktop header — whichever is visible at this size. */
  async function openMenu(page: Page) {
    await page
      .getByRole("button", { name: /^(Open menu|Menu)$/ })
      .filter({ visible: true })
      .first()
      .click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  }

  test("menu opens and closes without wedging the page", async ({ page }) => {
    await suppressPromo(page);
    await page.goto("/");
    await openMenu(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Menu" })).toHaveCount(0);

    await page.getByRole("navigation", { name: "Site links" }).getByRole("link", { name: "Wholesale" }).click();
    await expect(page).toHaveURL(/\/wholesale$/);
  });

  test("About drawer opens and closes", async ({ page }) => {
    await suppressPromo(page);
    await page.goto("/about");
    await page.getByRole("button", { name: /About Us/ }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);
  });

  test("switching to Arabic flips the page and survives a reload", async ({ page }) => {
    await suppressPromo(page);
    await page.goto("/ordering");
    await openMenu(page);
    await page.getByRole("button", { name: "العربية" }).click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("navigation", { name: "روابط الموقع" })).toBeVisible();
  });
});

test("links shared before the route split still land on the right page", async ({ page }) => {
  await suppressPromo(page);
  await page.goto("/#wholesale");
  await expect(page).toHaveURL(/\/wholesale$/);
});
