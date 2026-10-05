<p align="center">
  <img src="https://raw.githubusercontent.com/Switcherfaiz/switch-framework-icons/master/logo.svg" alt="Switch Framework" width="180" />
</p>

# switch-framework-icons

First-party icon font for [Switch Framework](https://github.com/Switcherfaiz/switch-framework). Same glyphs, two ways to use them.

After install you can also open the HTML instructions:

```
node_modules/switch-framework-icons/html/index.html
node_modules/switch-framework-icons/html/framework.html
node_modules/switch-framework-icons/html/standalone.html
node_modules/switch-framework-icons/html/icons.html
```

## Install

```bash
npm i switch-framework-icons
```

`create-switch-framework-app` already installs this next to `switch-framework` and `switch-framework-backend`. Do **not** add `switch-framework-icons` to `switchFramework.imports` — that list is for third-party packs. Icons are part of the SDK.

---

## 1. Independent project (any HTML / CSS app)

Load the stylesheet, then use a `span` with a `switch_icon_…` class. No Switch Framework, no custom element.

```html
<link rel="stylesheet" href="./node_modules/switch-framework-icons/style.css">

<button type="button">
  <span class="switch_icon_magnifying_glass" aria-hidden="true"></span>
  Search
</button>
```

From CSS:

```css
@import url("./node_modules/switch-framework-icons/style.css");
```

Do not `import 'switch-framework-icons/style.css'` from JavaScript unless you have a bundler. This package is no-build: the browser loads CSS as a URL.

---

## 2. Switch Framework project

Import the package so `<sw-icon>` is registered. The backend already maps `switch-framework-icons` (no allowlist). Put the font on the document once (the create-app template already does this):

```html
<link rel="stylesheet" href="/switch-framework-icons/style.css">
```

Then in a screen or component:

```javascript
import 'switch-framework-icons'; // registerComponent

render() {
  return `<sw-icon name="magnifying_glass" size="18"></sw-icon>`;
}
```

`name` is the icon id without the `switch_icon_` prefix. `size` is pixels when you pass a number (`18` → `18px`). Optional `label` sets `aria-label`. Color follows `currentColor`, so inline styles and CSS selectors both work — do not set `color` from the component.

```javascript
render() {
  return `<sw-icon name="heart" size="20" label="Like" style="color:#e60023"></sw-icon>`;
}
```

```javascript
styleSheet() {
  return `
    <style>
      @import url('/switch-framework-icons/style.css');
      sw-icon { font-size: 18px; color: var(--main_text); }
      .tab-btn.active sw-icon { color: #fff; }
    </style>
  `;
}
```

CSS `@import` does not use the JavaScript import map, so that URL must be the HTTP path above.

---

## Contribute

Add SVGs later under `icons/`, then run `npm run build` to refresh `names.json` and the catalog. Today the shipped source of truth is the generated `style.css` + `fonts/`.
