# Web Demo: Runiq → SVG

Below is a minimal browser-side demo that takes Runiq DSL text and renders it to SVG using `@runiq/web`.

> Note: This runs entirely in the browser. No server required.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Runiq Web Demo</title>
    <style>
      body {
        font-family:
          system-ui,
          -apple-system,
          Segoe UI,
          Roboto,
          Arial,
          sans-serif;
        margin: 2rem;
      }
      textarea {
        width: 100%;
        height: 220px;
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono',
          monospace;
      }
      #out {
        border: 1px solid #ddd;
        padding: 1rem;
        margin-top: 1rem;
      }
      .row {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .row > * {
        flex: 1;
      }
    </style>
  </head>
  <body>
    <h1>Runiq: Render DSL → SVG</h1>
    <div class="row">
      <textarea id="src">
diagram "My Diagram" {
  direction TB
  style s1 fillColor: "#eef"
  shape A as @rectangle label:"Hello" style: s1
  shape B as @rectangle label:"World"
  A -link-> B
}</textarea
      >
      <div id="out">SVG will appear here…</div>
    </div>
    <p>
      <button id="render">Render</button>
      <span id="status"></span>
    </p>

    <script type="module">
      import { renderRuniqToSvg } from 'https://cdn.skypack.dev/@runiq/web';

      const src = document.getElementById('src');
      const out = document.getElementById('out');
      const status = document.getElementById('status');
      const btn = document.getElementById('render');

      async function render() {
        status.textContent = 'Rendering…';
        try {
          const { svg, warnings } = await renderRuniqToSvg(
            src.value,
            { direction: 'TB' },
            { title: 'Demo' }
          );
          out.innerHTML = svg;
          status.textContent = warnings.length
            ? `Rendered with ${warnings.length} warning(s)`
            : 'Rendered';
        } catch (e) {
          out.textContent = e && e.message ? e.message : String(e);
          status.textContent = 'Error';
        }
      }

      btn.addEventListener('click', render);
      render();
    </script>
  </body>
</html>
```

If you prefer local bundling, install the package and import from `@runiq/web` instead of the CDN.

```bash
pnpm add @runiq/web
```

```ts
import { renderRuniqToSvg } from '@runiq/web';
```
