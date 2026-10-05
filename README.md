<p align="center">
  <img src="https://raw.githubusercontent.com/Switcherfaiz/switch-icons/master/logo.svg" alt="Switch Framework" width="180" />
</p>

# switch-icons

First-party icon font for [Switch Framework](https://github.com/Switcherfaiz/switch-framework). CSS classes, no bundler.

After install, open the HTML instructions in a browser:

```
node_modules/switch-icons/html/index.html
node_modules/switch-icons/html/framework.html
node_modules/switch-icons/html/standalone.html
node_modules/switch-icons/html/icons.html
```

## Install

`create-switch-framework-app` already installs this next to `switch-framework` and `switch-framework-backend`. For an existing app:

```bash
npm i switch-icons
```

Do **not** add `switch-icons` to `switchFramework.imports`. That list is for third-party packages. Icons are part of the SDK and are always mapped by `switch-framework-backend`.

## Switch Framework usage

Global (best for `@font-face`):

```html
<link rel="stylesheet" href="/switch-icons/style.css">
```

Inside `styleSheet()` use the HTTP URL. CSS `@import` does not read the JavaScript import map:

```javascript
styleSheet() {
  return `
    <style>
      @import url('/switch-icons/style.css');
    </style>
  `;
}

render() {
  return `<span class="switch_icon_magnifying_glass" aria-hidden="true"></span>`;
}
```

Do not `import 'switch-icons/style.css'` from JavaScript.

## Independent usage

v1 is CSS-only (no `peerDependencies`). Link `style.css` from any HTML page, or open `html/standalone.html`.

## Contribute

Add SVGs later under `icons/`, then run `npm run build` to refresh `names.json` and the catalog. Today the shipped source of truth is the generated `style.css` + `fonts/`.
