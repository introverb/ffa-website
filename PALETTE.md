# FFA Color Palette

The official color system for futureaesthetics.foundation. Tokens are
defined in [`tailwind.config.ts`](tailwind.config.ts) and used as
Tailwind classes (`bg-flare`, `text-ink`, `border-horizon`, etc.).

Nicknames are for talking about the palette; the **token** is what you
type in code.

## Foundations

The neutral structure: backgrounds, surfaces, text, and the dark panels.

| Nickname | Token | Hex | Where it lives |
|----------|-------|-----|----------------|
| Gallery wall | `paper` | `#FFFFFF` | Page/panel backgrounds |
| Vellum | `cream` | `#F5EEE4` | Card fills (tier cards, engagement cards) |
| Plaster | `taupe` / `rule` | `#D8D2C6` | Page background band, hairline rules |
| Charcoal | `ink` | `#3B3A3A` | Primary body + heading text |
| Graphite | `muted` | `#625F5B` | Secondary / muted text |
| Blackout | `dark` | `#151414` | Footer, dark panels, button hover |

`taupe` and `rule` are the same hex (`#D8D2C6`) — `rule` is the
semantic alias used for hairline borders, `taupe` for fills/bands.

## Accents

The three-accent system plus two warmer specials. Sage is the workhorse
(CTAs, eyebrows); flare and horizon joined it from the static briefs and
debut in the OURS Contributors tabs.

| Nickname | Token | Hex | Role |
|----------|-------|-----|------|
| Terrarium | `sage` | `#718676` | Primary accent — buttons, eyebrows, links |
| Greenhouse mist | `sage-light` | `#BDD6C3` | Soft sage — form-success states |
| Signal flare | `flare` | `#E8651A` | Orange accent — energy/art (Contributors: Artists) |
| Horizon line | `horizon` | `#7A9AAC` | Slate blue — vision (Contributors: Installation) |
| Reading chair | `leather` | `#5A4632` | Warm brown — rare saddle/leather accent |

### The three-accent mapping

The OURS Contributors section keys its groups to the three accents, and
this is the intended semantic split site-wide:

- **flare** (orange) — art, energy, the creative act
- **sage** (green) — action, growth, "take part" (it's the CTA color)
- **horizon** (blue) — vision, the future, the long view

## Note on the static briefs

The standalone HTML briefs in `/public` (patron, sponsor, artist) carry
their own CSS-variable palette that's a close cousin, not identical:

| Brief var | Hex | Site relative |
|-----------|-----|---------------|
| `--ink` | `#282828` | slightly darker than `ink` |
| `--cream` | `#F0EEEB` | slightly cooler than `cream` |
| `--green` | `#5A8A5E` | print-flavored `sage` |
| `--gold` | `#7A9AAC` | identical to `horizon` |
| `--orange` | `#E8651A` | identical to `flare` |
| `--mid` | `#646464` | no site equivalent |
| `--warm` | `#DCDCDC` | no site equivalent |

`flare` and `horizon` were promoted *from* these briefs, so the briefs
and the site now share their accent DNA exactly. Full harmonization of
ink/cream/green would be a small pass on the brief CSS if ever wanted.
