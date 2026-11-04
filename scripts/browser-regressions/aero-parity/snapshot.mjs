/** Freeze actual exported markup/styles before edits. No application source is changed. */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { exportIdentity, assertCaptureCompatibility, extensionRoutes, verifyFrozenCaptures, writeFrozenCapture } from "./snapshot-integrity.mjs";
const phase = process.argv[2] ?? "before";
if (!/^[a-z0-9-]+$/.test(phase))
    throw new Error("Use a simple lowercase phase name");
const expanded = process.argv.includes("--expanded");
const sourceSnapshotArg = process.argv.find(arg => arg.startsWith("--source-snapshot="));
const sourceSnapshotPhase = sourceSnapshotArg?.split("=")[1];
if (sourceSnapshotPhase && !/^[a-z0-9-]+$/.test(sourceSnapshotPhase))
    throw new Error("Invalid source snapshot phase");
const sourceSnapshot = sourceSnapshotPhase ? JSON.parse(await readFile(path.resolve("artifacts/aero-parity", sourceSnapshotPhase, "snapshot-manifest.json"), "utf8")) : null;
const appearance = process.argv.includes("--dark") ? "dark" : "light";
const origin = process.env.PORTFOLIO_PREVIEW_ORIGIN ?? "http://127.0.0.1:4398";
const output = path.resolve("artifacts/aero-parity", phase);
const extend = process.argv.includes("--extend");
const replace = process.argv.includes("--replace");
const refreshCensus = process.argv.includes("--refresh-census");
if (extend && replace)
    throw new Error("Choose either --extend or --replace");
if (refreshCensus && (extend || replace))
    throw new Error("Census refresh cannot replace or extend snapshot images");
let original;
try {
    original = JSON.parse(await readFile(path.join(output, "snapshot-manifest.json"), "utf8"));
}
catch (error) {
    if (error.code !== "ENOENT")
        throw error;
}
if (original && !extend && !replace && !refreshCensus)
    throw new Error("Snapshot already exists; choose a new phase or explicitly --replace it");
if (extend && !original)
    throw new Error("Cannot extend a missing snapshot");
if (refreshCensus && !original)
    throw new Error("Cannot refresh a missing snapshot");
if ((extend || refreshCensus) && (original.appearance ?? "light") !== appearance)
    throw new Error("Cannot extend a snapshot with a different appearance");
if ((extend || refreshCensus) && original.expanded && !expanded)
    throw new Error("Cannot downgrade an expanded snapshot; pass --expanded");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
    executablePath: process.env.PORTFOLIO_CHROMIUM_PATH ?? "/usr/bin/chromium",
    headless: true,
});
try {
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        locale: "en-AU",
        timezoneId: "Australia/Sydney",
        reducedMotion: "reduce",
        colorScheme: "light",
    });
    await context.addInitScript((theme) => localStorage.setItem("researchos.appearance.v1", theme), appearance);
    const page = await context.newPage();
    const sourceFiles = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
        encoding: "utf8",
    })
        .split("\0")
        .filter((p) => /\.(tsx?|css)$/.test(p) && !p.startsWith("work/"));
    const sourceHashes = {};
    for (const file of sourceFiles)
        sourceHashes[file] = createHash("sha256")
            .update(await readFile(file))
            .digest("hex");
    const versionResponse = await page.request.get(`${origin}/version.json`);
    const manifest = {
        phase,
        origin,
        capturedAt: new Date().toISOString(),
        sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
            encoding: "utf8",
        }).trim(),
        sourceStatus: execFileSync("git", ["status", "--porcelain"], {
            encoding: "utf8",
        }),
        browser: await browser.version(),
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        locale: "en-AU",
        timeZone: "Australia/Sydney",
        reducedMotion: "reduce",
        colourScheme: "light",
        appearance,
        expanded,
        version: await versionResponse.json(),
        sourceHashes,
        exportIdentity: await exportIdentity("out"),
        captureHashes: extend ? { ...original.captureHashes } : {},
        pages: extend ? [...original.pages] : [],
    };
    // Validate the export before writing ANY route snapshot or screenshot.
    if (extend || refreshCensus) {
        assertCaptureCompatibility(original, manifest);
        await verifyFrozenCaptures(output, original);
        manifest.sourceCommit = original.sourceCommit;
        manifest.sourceStatus = original.sourceStatus;
        manifest.sourceHashes = original.sourceHashes;
        manifest.initialCaptureAt =
            original.initialCaptureAt ?? original.capturedAt;
    }
    if (sourceSnapshot) {
        if (JSON.stringify(sourceSnapshot.version) !== JSON.stringify(manifest.version))
            throw new Error("Source snapshot does not match the served export");
        manifest.sourceCommit = sourceSnapshot.sourceCommit;
        manifest.sourceHashes = sourceSnapshot.sourceHashes;
        manifest.sourceStatus = sourceSnapshot.sourceStatus;
        manifest.sourceSnapshot = sourceSnapshotPhase;
    }
    const routes = [
        ["projects", "/projects"], ["about", "/about"], ["contact", "/contact"], ["project-detail", "/projects/project-simurgh"],
        ...(expanded ? [
            ["writeups", "/write-ups"], ["lab", "/lab/001"], ["resume", "/resume"],
            ["evidence", "/projects/invisible-window-research"], ["writeup-detail", "/write-ups/invisible-window-research"], ["not-found", "/not-a-portfolio-route", "404"],
            ["desktop", "/", "enter"], ["window-controls", "/projects", "window-controls"],
            ["language-menu", "/projects", "language-menu"], ["global-search", "/projects", "search"],
            ["contact-invalid", "/contact", "invalid"],
        ] : [])
    ];
    const censusPages = [];
    const pendingRoutes = extend ? extensionRoutes(routes, original) : routes;
    for (const [name, route, state] of pendingRoutes) {
        const errors = [];
        const onError = (e) => errors.push(e.message);
        page.on("pageerror", onError);
        const response = await page.goto(`${origin}${route}`, {
            waitUntil: "networkidle",
        });
        if (response.status() !== (state === "404" ? 404 : 200))
            throw new Error(`${route}: ${response.status()}`);
        if (state === "404")
            await page.locator('#not-found-language').waitFor();
        else if (state === "enter") {
            if (await page.locator('.os-enter').isVisible())
                await page.locator('.os-enter').click();
            await page.locator('.os-welcome').waitFor({ state: 'hidden' });
        }
        else
            await page.locator('[data-window-path][data-active="true"]:not([hidden])').waitFor();
        if (state === "window-controls") {
            await page.locator('[data-window-path][data-active="true"] .os-window-controls > summary').click();
            await page.locator('.os-window-controls-panel').waitFor();
        }
        if (state === "language-menu") {
            await page.locator('.os-language > summary').click();
            await page.locator('.os-language nav').waitFor();
        }
        if (state === "search") {
            await page.keyboard.press('Control+k');
            await page.locator('.os-search-dialog[open]').waitFor();
            await page.locator('#os-search-input').fill('Simurgh');
        }
        if (state === "invalid") {
            await page.locator('.os-secure-form button[type=submit]').click();
            await page.locator('#contact-name[aria-invalid=true]').waitFor();
        }
        await page.evaluate(() => document.fonts.ready);
        const data = await page.evaluate(() => ({
            html: document.documentElement.outerHTML,
            // This is a rendered-element census, not a claim that every member/state
            // has a pixel comparison or has been activated in the browser.
            interactiveElements: [...document.querySelectorAll('a[href],button,input:not([type="hidden"]),select,textarea,summary,[role="tab"],[role="switch"]')].filter((element) => {
                const box = element.getBoundingClientRect();
                const closedDetails = element.closest('details:not([open])');
                const visibleClosedSummary = closedDetails?.querySelector(':scope > summary');
                return box.width > 0 && box.height > 0 &&
                    !element.closest('[hidden],[inert],[aria-hidden="true"]') &&
                    (!closedDetails || visibleClosedSummary?.contains(element)) &&
                    element.checkVisibility({
                        contentVisibilityAuto: true,
                        visibilityProperty: true,
                        opacityProperty: true,
                    });
            }).map((element) => {
                const box = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                const ancestors = [];
                for (let parent = element.parentElement; parent && parent !== document.body && ancestors.length < 6; parent = parent.parentElement) {
                    ancestors.push({ tag: parent.tagName.toLowerCase(), classes: [...parent.classList] });
                }
                const nameHint = element.getAttribute('aria-label') ||
                    element.getAttribute('title') || element.innerText ||
                    element.getAttribute('placeholder') || '';
                return {
                    tag: element.tagName.toLowerCase(),
                    id: element.id,
                    classes: [...element.classList],
                    ancestors,
                    role: element.getAttribute('role'),
                    type: element.getAttribute('type'),
                    nameHint: nameHint.trim().replace(/\s+/g, ' ').slice(0, 160),
                    href: element.getAttribute('href'),
                    selected: element.getAttribute('aria-selected'),
                    pressed: element.getAttribute('aria-pressed'),
                    checked: element.getAttribute('aria-checked'),
                    invalid: element.getAttribute('aria-invalid'),
                    disabled: Boolean(element.disabled) || element.getAttribute('aria-disabled') === 'true',
                    expanded: element.getAttribute('aria-expanded'),
                    detailsOpen: element.closest('details')?.open ?? null,
                    rect: { x: box.x, y: box.y, width: box.width, height: box.height },
                    fontSize: style.fontSize,
                    visibility: style.visibility,
                    inViewport: box.bottom > 0 && box.right > 0 &&
                        box.top < innerHeight && box.left < innerWidth,
                };
            }),
            styleURLs: [...document.querySelectorAll('link[rel="stylesheet"]')].map((e) => e.href),
            inlineStyles: [...document.querySelectorAll("style")].map((e) => e.textContent),
        }));
        if (refreshCensus) {
            censusPages.push({
                name,
                route,
                state: state ?? "default",
                errors,
                elements: data.interactiveElements,
            });
            console.log(`Censused ${name}: ${data.interactiveElements.length} controls`);
            page.off("pageerror", onError);
            continue;
        }
        const sheets = [];
        for (const url of [...new Set(data.styleURLs)]) {
            const res = await page.request.get(url);
            if (!res.ok())
                throw new Error(`CSS ${res.status()} ${url}`);
            sheets.push({ url, css: await res.text() });
        }
        const json = JSON.stringify({ origin, route, ...data, sheets }, null, 2) + "\n";
        const png = await page.screenshot({ animations: "disabled" });
        Object.assign(manifest.captureHashes, await writeFrozenCapture(output, name, json, png, { replace }));
        manifest.pages.push({ name, route, state: state ?? "default", errors });
        console.log(`Captured ${name}: ${route} (${state ?? "default"})`);
        page.off("pageerror", onError);
    }
    if (refreshCensus) {
        await writeFile(path.join(output, "interactive-census.json"), JSON.stringify({
            phase,
            capturedAt: manifest.capturedAt,
            version: manifest.version,
            browser: manifest.browser,
            viewport: manifest.viewport,
            appearance,
            method: "Live DOM geometry, checkVisibility including native content visibility, closed-details summary exception, hidden/inert/aria-hidden exclusion. Off-viewport elements remain distinguished; occlusion is not tested. Name hints are not accessible-name proof.",
            sourceSnapshot: "snapshot-manifest.json",
            pages: censusPages,
        }, null, 2) + "\n");
    }
    else {
        await writeFile(path.join(output, "snapshot-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    }
    console.log(JSON.stringify({
        output,
        sourceCommit: manifest.sourceCommit,
        browser: manifest.browser,
        version: manifest.version,
        pages: manifest.pages,
    }));
    await context.close();
}
finally {
    await browser.close();
}
