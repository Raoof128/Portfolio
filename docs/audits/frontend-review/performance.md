# Performance

Final build `Dfv1QQLfhv_4WAY_tllxC` mobile lab sample: Chromium155.0.8059.79,390×844,4×CPU throttle,150ms emulated latency,1.6Mbps downstream; three fresh browser contexts per route against the local Cloudflare preview. This is a diagnostic lab profile on shared cloud hardware, not field p75.

| Route | Median LCP | Max sampled CLS | Resource transfer (excluding document) |
| --- | --- | --- | --- |
| Welcome |1260ms|0|318250 bytes|
| Projects |1632ms|0.000088|329465–330665 bytes|
| Simurgh |1504ms|0.000088|339426–342154 bytes|

All nine sampled LCPs were below2500ms and sampled CLS below0.1. The observer uses CLS session windows. No before/after speedup is claimed: this is candidate measurement only. Resource bytes are browser resource-timing transfer sizes, not compressed bundle size or whole-site payload. Background prefetch changes resource counts.

INP≤200ms and real-user75th-percentile CWV are unverified without representative field/interaction data. A few fast scripted interactions cannot certify INP. No arbitrary animation/artwork deletion or broad root-layout rewrite was justified by these samples. CSS/server-client restructuring remains a measurement-led follow-up rather than an unproven improvement.

Raw samples: [performance JSON](evidence/frontend-performance.json).
