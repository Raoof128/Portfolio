# Tactical HUD Cyberpunk Redesign

**Date**: 2026-03-21
**Status**: Approved

## Direction

Ghost in the Shell / Tactical HUD aesthetic. Clean, data-dense, terminal-inspired.
Transform from "dark site with occasional cyan" to "active tactical HUD that's always subtly humming."

## Color System

| Token | Old | New |
|-------|-----|-----|
| `--background` | `#09090b` | `#06080d` (blue undertone) |
| `--surface` | `rgba(255,255,255,0.03)` | `rgba(6,182,212,0.03)` (cyan-tinted) |
| `--foreground` | `#e4e4e7` | `#e2e8f0` (slate-200, cooler) |
| body text | zinc-400 | `#94a3b8` (slate-400) |
| metadata/labels | zinc-600 | `rgba(6,182,212,0.7)` (cyan/70) |
| structural borders | white/8 | `cyan/10` |
| section dividers | subtle gradient | stronger cyan/40 to purple/30 |

## Typography

- All metadata labels: mono + cyan/70 + tracking-widest
- Section numbers: add text-shadow glow
- Card badges: mono prefix `[SYS]`, `[OPS]`, `[SEC]`
- Data coordinate stamps on section headers

## Interactive States

- Card hover: y:-6px, border cyan/10 -> cyan/30, bg-cyan/[0.04], shadow glow
- Button hover: stronger neon bloom (0.4 opacity shadow)
- Link hover: text-shadow glow
- Focus: ring-2 ring-cyan/60 ring-offset-2 ring-offset-[#06080d]

## Atmosphere

- Scanline: 0.03 -> 0.08 opacity
- Grid: cyan-tinted lines at rgba(6,182,212,0.04)
- Noise/grain: 0.02 -> 0.04
- Ghost letters: 0.04 -> 0.07
- HUD corners: w-4 -> w-5, corner dot, pulse on hover

## Implementation Phases

1. Core tokens in globals.css
2. Atmosphere layers (Scanline, GridBackground)
3. Component updates (GlowCard, HUDFrame, NeonButton, BentoCard)
4. Page-level integration (section headers, data coords, ticker, philosophy)
