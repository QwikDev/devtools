---
'@qwik.dev/devtools': patch
---

fix(ui): Preloads overflow clipping and CodeBreak button placement

- Preloads panel: outer `overflow-hidden` clipped stat cards and prevented scroll when content exceeded the panel height. Switched to `overflow-auto` with `min-h-full` on the column stack so content scrolls on narrow or short panels.
- CodeBreak StateParser: content container was missing the `flex` class, so the textarea pushed the `Parse State` button outside the card into the next grid row, overlapping the `Parsed State` header. Moved the button into the card header next to the title — robust across panel widths and cleaner UX.
