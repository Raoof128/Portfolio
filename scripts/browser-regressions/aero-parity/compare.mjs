/** Compare actual exported component snapshots with untouched official 7.css.
 * Run snapshot.mjs first. Fixtures preserve actual DOM, ancestors and styles;
 * only the camera (position, neutral backdrop) and window sample content change.
 * The natural candidate geometry is recorded before isolation, never rescaled.
 */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { comparePNGs } from "./png-diff.mjs";
import { round2Specimens } from "./round2-specimens.mjs";
const phase = process.argv[2] ?? "before";
if (!/^[a-z0-9-]+$/.test(phase))
  throw new Error("Use a simple lowercase phase name");
const directory = path.resolve("artifacts/aero-parity", phase),
  output = path.join(directory, "comparisons");
await mkdir(output, { recursive: true });
const officialCSS = await readFile(
  "node_modules/7.css/dist/7.scoped.css",
  "utf8",
);
const snapshotManifest = JSON.parse(
  await readFile(path.join(directory, "snapshot-manifest.json"), "utf8"),
);
const snapshots = {};
for (const { name } of snapshotManifest.pages)
  snapshots[name] = JSON.parse(
    await readFile(path.join(directory, `${name}.json`), "utf8"),
  );
const fontResources = {};
for (const snapshot of Object.values(snapshots)) {
  const prepared = [];
  for (const sheet of snapshot.sheets) {
    let css = sheet.css;
    const replacements = [];
    for (const match of css.matchAll(
      /url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/g,
    )) {
      const value = (match[1] ?? match[2] ?? match[3]).trim();
      if (value.startsWith("data:") || value.startsWith("#")) continue;
      const url = new URL(value, sheet.url);
      if (!/\.woff2?$/.test(url.pathname))
        throw new Error(`Unfrozen CSS asset ${url.href}`);
      const fontDirectory = path.join(directory, "fonts");
      await mkdir(fontDirectory, { recursive: true });
      const frozenPath = path.join(fontDirectory, path.basename(url.pathname));
      let bytes;
      try {
        bytes = await readFile(frozenPath);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        bytes = await readFile(path.join("out", url.pathname));
        await writeFile(frozenPath, bytes);
      }
      const key = url.pathname;
      fontResources[key] = {
        sha256: createHash("sha256").update(bytes).digest("hex"),
        bytes: bytes.length,
      };
      replacements.push([
        match[0],
        `url("data:font/woff2;base64,${bytes.toString("base64")}")`,
      ]);
    }
    for (const [from, to] of replacements) css = css.replaceAll(from, to);
    prepared.push(css);
  }
  snapshot.preparedCSS = [...prepared, ...snapshot.inlineStyles].join("\n");
  snapshot.fontFaces = (
    snapshot.preparedCSS.match(/@font-face\s*\{[^}]*\}/g) ?? []
  ).join("\n");
}
const escape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const cameraCSS = `html,body{margin:0!important;background:#90b5d0!important;}:where(body *){visibility:hidden!important;}.aero-ancestor{visibility:visible!important;background:none!important;box-shadow:none!important;border-color:transparent!important;outline:none!important;}.aero-ancestor::before,.aero-ancestor::after{visibility:hidden!important;}#aero-target,#aero-target *{visibility:visible!important;}*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;}[data-aero-state-target]{--aero-hover:0;--aero-active:0;--aero-focus:0;}[data-aero-state-target]:hover{--aero-hover:1;}[data-aero-state-target]:active{--aero-active:1;}[data-aero-state-target]:focus-visible{--aero-focus:1;}`;
function candidateDocument(snapshot, camera) {
  // Scripts are deliberately removed: a frozen visual specimen cannot navigate or mutate.
  let html = snapshot.html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<img\b[^>]*>/gi, "");
  const css = snapshot.preparedCSS;
  return html.replace(
    "<head>",
    `<head><base href="${escape(snapshot.origin)}"><style>${css}</style><style>${camera}</style>`,
  );
}
const captionMarkup =
  '<div class="title-bar-controls"><button class="is-minimize" aria-label="Minimize"></button><button class="is-maximize" aria-label="Maximize"></button><button class="is-close" aria-label="Close"></button></div>';
const windowMarkup = `<section class="window glass active"><div class="title-bar"><div class="title-bar-text">Projects</div>${captionMarkup}</div><div class="window-body has-space"><p>Aero window specimen</p></div></section>`;
const specimens = [
  {
    id: "window",
    page: "projects",
    candidate: '[data-window-path][data-active="true"]:not([hidden])',
    reference: ".window",
    markup: windowMarkup,
    states: ["default", "inactive"],
    window: true,
  },
  {
    id: "titlebar",
    page: "projects",
    candidate: '[data-window-path][data-active="true"] > .title-bar',
    reference: ".title-bar",
    markup: windowMarkup,
    states: ["default", "inactive"],
  },
  {
    id: "caption-group",
    page: "projects",
    candidate:
      '[data-window-path][data-active="true"] > .title-bar > .title-bar-controls',
    reference: ".title-bar-controls",
    markup: windowMarkup,
    states: ["default", "inactive", "disabled"],
  },
  ...["minimize", "maximize", "restore", "close"].map((kind) => ({
    id: kind,
    page: "projects",
    candidate: `[data-window-path][data-active="true"] .${kind === "restore" ? "is-maximize" : `is-${kind}`}`,
    reference: `.${kind === "restore" ? "is-maximize" : `is-${kind}`}`,
    markup: windowMarkup,
    states: ["default", "hover", "pressed", "focus", "disabled", "inactive"],
    restore: kind === "restore",
  })),
  {
    id: "command-button",
    page: "projects",
    candidate: '[data-window-path][data-active="true"] .os-window-copy',
    reference: ".specimen",
    markup: '<button class="specimen">Copy Link</button>',
    states: ["default", "hover", "pressed", "focus", "disabled"],
  },
  {
    id: "search-field",
    page: "projects",
    candidate: '.os-project-explorer input[type="search"]',
    reference: ".specimen",
    markup:
      '<div class="searchbox"><input class="specimen" type="search" placeholder="Search Projects"><button aria-label="Search"></button></div>',
    states: ["default", "hover", "focus", "disabled"],
  },
  {
    id: "category-select",
    page: "projects",
    candidate: ".os-project-explorer select",
    reference: ".specimen",
    markup:
      '<select class="specimen"><option>All Categories</option><option>Engineering</option></select>',
    states: ["default", "hover", "focus", "disabled"],
  },
  {
    id: "contact-textbox",
    page: "contact",
    candidate: "#contact-name",
    reference: ".specimen",
    markup: '<input class="specimen" type="text" placeholder="Your name">',
    states: ["default", "hover", "focus", "disabled"],
  },
  {
    id: "dossier-tabs",
    page: "project-detail",
    candidate: ".os-project-tablist",
    reference: "[role=tablist]",
    markup:
      '<menu role="tablist"><button role="tab" aria-selected="true">Overview</button><button role="tab">Technical Details</button><button role="tab">Evidence</button></menu>',
    states: ["default", "hover", "pressed", "focus"],
  },
  {
    id: "document-action",
    page: "about",
    candidate: '[data-window-path][data-active="true"] .os-button',
    reference: ".specimen",
    markup: '<button class="specimen default"></button>',
    states: ["default", "hover", "pressed", "focus"],
  },
];
if (snapshotManifest.expanded) specimens.push(...round2Specimens);
if (process.env.AERO_COMPONENT && !specimens.some(s=>s.id===process.env.AERO_COMPONENT)) throw new Error("Unknown AERO_COMPONENT");
const properties = [
  "box-sizing",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-color",
  "border-radius",
  "box-shadow",
  "background-color",
  "background-image",
  "background-position",
  "background-size",
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "text-shadow",
  "outline",
  "outline-offset",
  "opacity",
  "backdrop-filter",
];
async function metrics(locator) {
  return locator.evaluate((el, keys) => {
    const box = el.getBoundingClientRect();
    const styles = {};
    for (const pseudo of ["element", "::before", "::after"]) {
      const s = getComputedStyle(el, pseudo === "element" ? null : pseudo);
      styles[pseudo] = Object.fromEntries(
        keys.map((k) => [k, s.getPropertyValue(k)]),
      );
      styles[pseudo].content = s.content;
      styles[pseudo].width = s.width;
      styles[pseudo].height = s.height;
    }
    return { width: box.width, height: box.height, styles };
  }, properties);
}
async function isolate(page, specimen, candidate) {
  const selector = candidate ? specimen.candidate : specimen.reference;
  const target = page.locator(selector).first();
  await target.waitFor({ state: "attached" });
  const liveGeometry = await metrics(target);
  // Equal EXTERNAL window dimensions; preserve each skin's box-sizing and borders.
  if (
    specimen.window || specimen.chrome ||
    [
      "titlebar",
      "caption-group",
      "minimize",
      "maximize",
      "restore",
      "close",
    ].includes(specimen.id)
  ) {
    await target.evaluate((el) => {
      const w = el.closest(".window"),
        s = getComputedStyle(w);
      const extra =
        s.boxSizing === "border-box"
          ? 0
          : parseFloat(s.paddingLeft) +
            parseFloat(s.paddingRight) +
            parseFloat(s.borderLeftWidth) +
            parseFloat(s.borderRightWidth);
      Object.assign(w.style, { width: `${640 - extra}px`, maxWidth: "none" });
    });
  }
  const natural = await metrics(target);
  await target.evaluate(
    (el, { windowSample, fluidWidth, sample, height }) => {
      el.id = "aero-target";
      for (
        let parent = el.parentElement;
        parent && parent !== document.body;
        parent = parent.parentElement
      )
        parent.classList.add("aero-ancestor");
      if (windowSample) {
        const body = el.querySelector(".window-body");
        if (body) body.innerHTML = "<p>Aero window specimen</p>";
        for (const child of [...el.children])
          if (!child.matches(".title-bar,.window-body")) child.remove();
      }
      if(sample === "groupbox") {
        const legend = el.querySelector("legend")?.textContent ?? "Window Controls";
        el.replaceChildren(Object.assign(document.createElement("legend"),{textContent:legend}), Object.assign(document.createElement("p"),{textContent:"Aero group specimen"}));
      }
      if(sample === "scrollbar") {
        el.innerHTML = '<div style="height:420px">Aero scroll specimen</div>';
        el.style.overflowY="scroll";
        el.style.overflowX="hidden";
      }
      const rect = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const bx =
        s.boxSizing === "border-box"
          ? 0
          : parseFloat(s.paddingLeft) +
            parseFloat(s.paddingRight) +
            parseFloat(s.borderLeftWidth) +
            parseFloat(s.borderRightWidth);
      const by =
        s.boxSizing === "border-box"
          ? 0
          : parseFloat(s.paddingTop) +
            parseFloat(s.paddingBottom) +
            parseFloat(s.borderTopWidth) +
            parseFloat(s.borderBottomWidth);
      Object.assign(el.style, {
        position: "fixed",
        left: "80px",
        top: "80px",
        margin: "0",
        transform: "none",
        width: `${(windowSample ? 640 : (fluidWidth ?? rect.width)) - bx}px`,
        height: `${(windowSample ? 240 : (height ?? rect.height)) - by}px`,
        minHeight: windowSample ? "0" : el.style.minHeight,
        maxHeight: "none",
        maxWidth: "none",
      });
      if (windowSample) {
        const body = el.querySelector(".window-body"),
          title = el.querySelector(".title-bar");
        if (body && title) {
          const b = getComputedStyle(body);
          const e = getComputedStyle(el);
          const available =
            240 -
            parseFloat(e.borderTopWidth) -
            parseFloat(e.borderBottomWidth) -
            parseFloat(e.paddingTop) -
            parseFloat(e.paddingBottom) -
            title.getBoundingClientRect().height -
            parseFloat(b.marginTop) -
            parseFloat(b.marginBottom);
          const extra =
            b.boxSizing === "border-box"
              ? 0
              : parseFloat(b.paddingTop) +
                parseFloat(b.paddingBottom) +
                parseFloat(b.borderTopWidth) +
                parseFloat(b.borderBottomWidth);
          Object.assign(body.style, {
            height: `${Math.max(0, available - extra)}px`,
            minHeight: "0",
            flex: "none",
          });
        }
      }
    },
    {
      windowSample: !!specimen.window,
      sample: specimen.sample,
      height: specimen.height,
      fluidWidth: specimen.width ?? (["search-field", "contact-textbox"].includes(specimen.id)
        ? 320
        : specimen.id === "category-select"
          ? 240
          : specimen.id === "dossier-tabs"
            ? 640
            : null),
    },
  );
  return { target: page.locator("#aero-target"), natural, liveGeometry };
}
async function titleContentBounds(locator) {
  return locator.evaluate((el) => {
    const root = el.getBoundingClientRect(),
      rectangles = [];
    const label = el.querySelector(".title-bar-text");
    if (label) {
      const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode())
        if (node.textContent.trim()) {
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const r of range.getClientRects())
            rectangles.push({
              x: r.x - root.x + 16,
              y: r.y - root.y + 16,
              width: r.width,
              height: r.height,
            });
        }
    }
    const icon = el.querySelector(".os-window-navigation");
    if (icon) {
      const r = icon.getBoundingClientRect();
      rectangles.push({
        x: r.x - root.x + 16,
        y: r.y - root.y + 16,
        width: r.width,
        height: r.height,
      });
    }
    return rectangles;
  });
}
function chromeMask(rectangles) {
  const outer = { x: 16, y: 16, width: 640, height: 240 },
    edge = 7,
    titleHeight = 28,
    glowPadding = 10;
  const left = Math.max(
    outer.x + edge,
    Math.min(...rectangles.map((r) => r.x)) - glowPadding,
  );
  const top = Math.max(
    outer.y + 1,
    Math.min(...rectangles.map((r) => r.y)) - glowPadding,
  );
  const right = Math.min(
    outer.x + outer.width - edge,
    Math.max(...rectangles.map((r) => r.x + r.width)) + glowPadding,
  );
  const bottom = Math.min(
    outer.y + titleHeight,
    Math.max(...rectangles.map((r) => r.y + r.height)) + glowPadding,
  );
  return {
    kind: "window-chrome",
    outer,
    edge,
    titleHeight,
    labelExclusion: {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    },
    labelSourceBounds: rectangles,
    glowPadding,
  };
}
const browserOptions = {
  executablePath: process.env.PORTFOLIO_CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
};
let browser = await chromium.launch(browserOptions);
const results = [];
try {
  const contextOptions = {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    colorScheme: "light",
    locale: "en-AU",
    timezoneId: "Australia/Sydney",
  };
  let context = await browser.newContext(contextOptions);
  let candidate = await context.newPage(),
    reference = await context.newPage();
  let scrollbarsVisible = false;
  for (const specimen of specimens.filter(
    (s) => !process.env.AERO_COMPONENT || s.id === process.env.AERO_COMPONENT,
  ))
    for (const state of specimen.states) {
      if (specimen.sample === "scrollbar" && !scrollbarsVisible) {
        await context.close();
        await browser.close();
        // Default headless Chromium hides scrollbars. Relaunch only for this
        // specimen; other accepted image cohorts keep their original settings.
        browser = await chromium.launch({
          ...browserOptions,
          ignoreDefaultArgs: ["--hide-scrollbars"],
        });
        context = await browser.newContext(contextOptions);
        candidate = await context.newPage();
        reference = await context.newPage();
        scrollbarsVisible = true;
      }
      const backdrop = specimen.window || specimen.chrome || [
        "window",
        "titlebar",
        "caption-group",
        "minimize",
        "maximize",
        "restore",
        "close",
      ].includes(specimen.id)
        ? "#90b5d0"
        : "#ffffff";
      const camera = cameraCSS.replaceAll("#90b5d0", backdrop);
      await candidate.setContent(
        candidateDocument(snapshots[specimen.page], camera),
        {
          waitUntil: "load",
        },
      );
      await reference.setContent(
        `<html><head><style>${officialCSS}</style><style>${snapshots[specimen.page].fontFaces}</style><style>${camera}</style></head><body><div class="win7">${specimen.markup}</div></body></html>`,
        { waitUntil: "load" },
      );
      // 7.css's `has-space` body padding is optional. The reference body carries it only when
      // the actual window body does, so the same canonical variant is compared on both sides.
      if (specimen.window) {
        const hasSpace = await candidate
          .locator(specimen.candidate)
          .first()
          .evaluate((el) => el.querySelector(".window-body")?.classList.contains("has-space") ?? true);
        await reference
          .locator(".window-body")
          .first()
          .evaluate((body, on) => body.classList.toggle("has-space", on), hasSpace);
      }
      // Equal wording for content-dependent control dimensions, without altering either skin.
      if (specimen.id === "document-action" || specimen.matchContent) {
        const content = await candidate
          .locator(specimen.candidate)
          .first()
          .innerHTML();
        await reference
          .locator(specimen.reference)
          .evaluate((e, html) => (e.innerHTML = html), content);
      }
      if(specimen.matchPlaceholder || specimen.matchOptions || specimen.matchValue || specimen.sample === "groupbox") {
        const content = await candidate.locator(specimen.candidate).first().evaluate(e=>({placeholder:e.getAttribute("placeholder"),value:e.value,html:e.innerHTML,legend:e.querySelector("legend")?.textContent, rows:e.rows}));
        await reference.locator(specimen.reference).first().evaluate((e, {content,specimen})=>{
          if(specimen.matchPlaceholder && content.placeholder) e.setAttribute("placeholder",content.placeholder);
          if(specimen.matchOptions)e.innerHTML=content.html;
          if(specimen.matchValue)e.value=content.value;
          if(content.rows)e.rows=content.rows;
          if(specimen.sample==="groupbox") e.querySelector("legend").textContent=content.legend;
        },{content,specimen});
      }
      if (specimen.id === "dossier-tabs") {
        const labels = await candidate
          .locator(specimen.candidate)
          .locator('[role="tab"]')
          .allTextContents();
        await reference.locator(specimen.reference).evaluate((menu, labels) => {
          menu.replaceChildren(
            ...labels.map((label, i) => {
              const button = document.createElement("button");
              button.setAttribute("role", "tab");
              button.setAttribute("aria-selected", String(i === 0));
              button.textContent = label;
              return button;
            }),
          );
        }, labels);
      }
      const specimenFont = await candidate
        .locator(specimen.candidate)
        .first()
        .evaluate((e) => getComputedStyle(e).fontFamily);
      await reference
        .locator(".win7")
        .evaluate(
          (e, family) => e.style.setProperty("--w7-font", `9pt ${family}`),
          specimenFont,
        );
      await Promise.all([
        candidate.evaluate(() => document.fonts.ready),
        reference.evaluate(() => document.fonts.ready),
      ]);
      const targets = await Promise.all([
        isolate(candidate, specimen, true),
        isolate(reference, specimen, false),
      ]);
      if (specimen.restore)
        for (const { target } of targets)
          await target.evaluate((e) => {
            e.classList.replace("is-maximize", "is-restore");
            e.setAttribute("aria-label", "Restore");
          });
      if (state === "inactive")
        for (const { target } of targets)
          await target.evaluate((e) => {
            const w = e.closest(".window");
            w?.classList.remove("active");
            w?.setAttribute("data-active", "false");
            e.closest(".title-bar")?.classList.remove("active");
          });
      if (state === "disabled")
        for (const { target } of targets)
          await target.evaluate((e) => {
            if (e.matches("button,input,select,textarea")) e.disabled = true;
            else
              e.querySelectorAll("button").forEach((b) => (b.disabled = true));
          });
      if(state === "scrolled") for(const {target} of targets) await target.evaluate(e=>e.scrollTop=100);
      const initial = await Promise.all(
        targets.map(({ target }) => metrics(target)),
      );
      const extent = {
        width: Math.ceil(Math.max(...initial.map((m) => m.width))) + 32,
        height: Math.ceil(Math.max(...initial.map((m) => m.height))) + 32,
      };
      const stem = path.join(output, `${specimen.id}-${state}`);
      const observed = [];
      const stateVerification = [];
      const nativeScrollbarVerification = [];
      const labelBounds = [];
      for (const [index, page] of [candidate, reference].entries()) {
        await page.bringToFront();
        await page.evaluate(() =>
          document.addEventListener("click", (e) => e.preventDefault(), {
            capture: true,
            once: true,
          }),
        );
        await page.mouse.move(1300, 800);
        const target =
          specimen.id === "dossier-tabs"
            ? targets[index].target.locator("[role=tab]").nth(1)
            : targets[index].target;
        await target.evaluate((e) =>
          e.setAttribute("data-aero-state-target", ""),
        );
        if (state === "focus") {
          await page.keyboard.press("Tab");
          await target.focus();
          if (
            !(await target.evaluate(
              (e) =>
                e === document.activeElement &&
                getComputedStyle(e).getPropertyValue("--aero-focus").trim() ===
                  "1",
            ))
          )
            throw new Error(
              `${specimen.id}: focus-visible state did not activate`,
            );
        }
        if (state === "hover" || state === "pressed") {
          if(specimen.sample === "scrollbar") {
            const box=await target.boundingBox();
            const scroll = await target.evaluate((e) => ({
              clientHeight: e.clientHeight,
              scrollHeight: e.scrollHeight,
            }));
            // The canonical vertical arrow buttons are 17px. Aim at the
            // initial thumb centre, not the middle of the track below it.
            const thumbHeight = (box.height - 34) * scroll.clientHeight / scroll.scrollHeight;
            await page.mouse.move(box.x + box.width - 8, box.y + 17 + thumbHeight / 2);
          } else await target.hover();
          await page.evaluate(() => new Promise(requestAnimationFrame));
        }
        if (
          state === "hover" &&
          !(await target.evaluate(
            (e) =>
              getComputedStyle(e).getPropertyValue("--aero-hover").trim() ===
              "1",
          ))
        )
          throw new Error(`${specimen.id}: hover state did not activate`);
        if (state === "pressed") {
          if (specimen.sample === "scrollbar") {
            const box = await target.boundingBox();
            await page.screenshot({
              path: `${stem}-${index}-before-press.png`,
              clip: { x: box.x + box.width - 24, y: box.y, width: 24, height: box.height },
              animations: "disabled",
            });
          }
          await page.mouse.down();
          if (
            specimen.sample !== "scrollbar" &&
            !(await target.evaluate(
              (e) =>
                getComputedStyle(e).getPropertyValue("--aero-active").trim() ===
                "1",
            ))
          )
            throw new Error(`${specimen.id}: pressed state did not activate`);
        }
        if (
          state === "disabled" &&
          !(await target.evaluate(
            (e) =>
              e.disabled === true ||
              [...e.querySelectorAll("button")].every((b) => b.disabled),
          ))
        )
          throw new Error(`${specimen.id}: disabled state did not activate`);
        if (state === "scrolled" && await target.evaluate((e) => e.scrollTop) !== 100)
          throw new Error(`${specimen.id}: requested scroll position did not activate`);
        stateVerification.push(
          await target.evaluate((e) => ({
            hover:
              getComputedStyle(e).getPropertyValue("--aero-hover").trim() ===
              "1",
            pressed:
              getComputedStyle(e).getPropertyValue("--aero-active").trim() ===
              "1",
            focusVisible:
              getComputedStyle(e).getPropertyValue("--aero-focus").trim() ===
              "1",
            focused: e === document.activeElement,
            disabled: e.disabled === true,
            selected: e.getAttribute("aria-selected"),
            pressedSelection: e.getAttribute("aria-pressed"),
            invalid: e.getAttribute("aria-invalid"),
            scrollTop:e.scrollTop,
            scrollHeight:e.scrollHeight,
            clientHeight:e.clientHeight,
            tabSelections: [...e.querySelectorAll("[role=tab]")].map((t) =>
              t.getAttribute("aria-selected"),
            ),
          })),
        );
        observed.push(await metrics(targets[index].target));
        if (specimen.window)
          labelBounds.push(
            ...(await titleContentBounds(targets[index].target)),
          );
        const box = await targets[index].target.boundingBox();
        const clip = specimen.sample === "scrollbar" ? {x:box.x+box.width-24,y:box.y,width:24,height:box.height} : {
          x: Math.max(0, box.x - 16),
          y: Math.max(0, box.y - 16),
          ...extent,
        };
        await page.screenshot({
          path: `${stem}-${index === 0 ? "candidate" : "reference"}.png`,
          clip,
          animations: "disabled",
        });
        if (state === "pressed" && specimen.sample === "scrollbar") {
          const transition = await comparePNGs(
            `${stem}-${index}-before-press.png`,
            `${stem}-${index === 0 ? "candidate" : "reference"}.png`,
            `${stem}-${index}-press-transition`,
          );
          if (!transition.exactDifferentPixels)
            throw new Error(`${specimen.id}: held thumb did not change from its hover paint`);
          nativeScrollbarVerification.push({
            target: index === 0 ? "candidate" : "reference",
            pointer: "left button held over measured thumb centre",
            hoverToPressedDifferentPixels: transition.exactDifferentPixels,
            oracle: "native scrollbar paint transition; host :active is not its pseudo-element state",
          });
        }
        if (state === "pressed") await page.mouse.up();
      }
      const differences = [];
      for (const pseudo of ["element", "::before", "::after"])
        for (const property of Object.keys(observed[0].styles[pseudo]))
          if (
            observed[0].styles[pseudo][property] !==
            observed[1].styles[pseudo][property]
          )
            differences.push({
              pseudo,
              property,
              candidate: observed[0].styles[pseudo][property],
              reference: observed[1].styles[pseudo][property],
            });
      results.push({
        component: specimen.id,
        state,
        page:specimen.page,
        selector:specimen.candidate,
        canonicalFamily:specimen.canonicalFamily ?? specimen.id,
        browserConditions: {
          headlessDefaultHideScrollbarsOmitted: specimen.sample === "scrollbar",
        },
        normalization:specimen.sample ?? "existing camera",
        backdrop,
        stateVerification,
        nativeScrollbarVerification,
        candidateLive: targets[0].liveGeometry,
        referenceUnconstrained: targets[1].liveGeometry,
        candidateNatural: targets[0].natural,
        referenceNatural: targets[1].natural,
        candidate: observed[0],
        reference: observed[1],
        differences,
        interactedControl:
          specimen.id === "dossier-tabs"
            ? "second role=tab child"
            : "specimen itself",
        fontNormalization: {
          family: specimenFont,
          referenceFont: "9pt " + specimenFont,
        },
        pixels: await comparePNGs(
          `${stem}-reference.png`,
          `${stem}-candidate.png`,
          stem,
          specimen.window ? chromeMask(labelBounds) : null,
        ),
        files: {
          reference: `${specimen.id}-${state}-reference.png`,
          candidate: `${specimen.id}-${state}-candidate.png`,
          overlay: `${specimen.id}-${state}-overlay.png`,
          diff: `${specimen.id}-${state}-diff.png`,
        },
      });
      console.log(
        `${specimen.id}/${state}: ${observed[0].width}x${observed[0].height} vs ${observed[1].width}x${observed[1].height}`,
      );
    }
  const manifest = {
    phase,
    fontResources,
    source: snapshotManifest,
    reference: {
      package: "7.css@0.21.1",
      path: "node_modules/7.css/dist/7.scoped.css",
      sha256: createHash("sha256").update(officialCSS).digest("hex"),
    },
    browser: await browser.version(),
    conditions: {
      viewport: "1440x900",
      dpr: 1,
      zoom: 1,
      backdrop:
        "#90b5d0 for glass chrome; #ffffff for opaque document controls",
      animations: "disabled equally",
      scrollbarVisibility: "Only scrollbar specimen relaunches with headless --hide-scrollbars default omitted; other image cohorts retain normal headless defaults. Revisions identify earlier blank scrollbar crops.",
      colourScheme: "light",
      theme: `candidate ${snapshotManifest.appearance ?? "light"}; canonical reference remains published light`,
      fontAvailability:
        "same host and same explicit family for both via canonical --w7-font; reference retains9pt fontsize and nativeweight",
      geometry:
        "natural caption/button dimensions; window sample640x240 with bodyfill; fluidinput outerwidth320/select240/tablist640; equal tab wording and buttonicon content; original live dimensions retained",
      fixtureLimits:
        "Actual DOM, classes, ancestor selectors and CSS; scripts removed; neutral backdrop and camera positions. Window sample removes toolbar/content controls to compare frame and caption; live whole-page captures remain separate. No whole-OS exact parity inference.",
    },
    comparisonCount: results.length,
    results,
  };
  await writeFile(
    path.join(
      output,
      process.env.AERO_COMPONENT
        ? `results-${process.env.AERO_COMPONENT}.json`
        : "results.json",
    ),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  await context.close();
} finally {
  await browser.close();
}
