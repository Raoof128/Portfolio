# Native Chromium zoom helper

Run from the repository root after the preview serves the intended export:

```sh
node scripts/browser-regressions/native-zoom.mjs http://127.0.0.1:4398 work/full-frontend-audit/native-zoom-final / /projects /projects/project-simurgh /resume /contact /fa/projects/project-simurgh /es/projects/project-simurgh /zh/projects/project-simurgh
```

Arguments are preview origin, output directory, then route paths. Omitted routes default to home, Projects and Simurgh. The script uses the already-installed Playwright dependency and `/usr/bin/chromium`; it never rebuilds the app. Each invocation creates a fresh temporary persistent browser profile that Playwright removes on close. It changes Page zoom only through Chromium's own settings UI and leaves user profiles and browser policies alone.

`geometry.json` records the browser version, real available zoom options,100% reference metrics, each200%/400% observation, initial-fold and scrolled PNG names, and success/error status. The helper exits nonzero when zoom, HTTP status, fixed physical window, CSS reflow, visual viewport scale, horizontal overflow or scrolling assertions fail. Native zoom is demonstrated by DPR2/4 and CSS widths640/320 with a fixed1280-pixel window and visual scale1. There is no pinch/pageScaleFactor/CSS zoom/viewport-resize substitute.

`native-zoom-maintained/geometry.json` and its12 PNGs are the successful three-route/six-observation smoke run on the existing4398 baseline. Final rebuilt-export verification belongs to the parent. Initial extension timeouts did not establish an application defect.

Playwright screenshot clipping produced blank images after document scrolling at native zoom. The same visible DOM/scroll position captured correctly through read-only CDP `Page.captureScreenshot`; the maintained helper therefore uses that command solely to save pixels. It does not use CDP to set zoom or device metrics. The earlier blank diagnostic PNGs remain in `native-zoom/` alongside the raw-capture comparison; use `native-zoom-maintained/` for valid smoke screenshots.
