import ICON_NAMES from './names.js';

export { ICON_NAMES };

export function iconClass(name) {
  const id = String(name || '').trim().replace(/^switch_icon_/, '').replace(/-/g, '_');
  return id && /^[A-Za-z0-9_]+$/.test(id) ? `switch_icon_${id}` : '';
}

function ensureIconSheet() {
  if (typeof document === 'undefined') return;
  if (!document.querySelector('link[data-switch-framework-icons], link[href="/switch-framework-icons/style.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/switch-framework-icons/style.css';
    link.setAttribute('data-switch-framework-icons', '');
    document.head.appendChild(link);
  }
  if (!document.getElementById('sw-icon-host-style')) {
    const style = document.createElement('style');
    style.id = 'sw-icon-host-style';
    style.textContent = `
      sw-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        color: inherit;
        font-size: inherit;
        vertical-align: middle;
      }
      sw-icon > span {
        color: inherit;
        font-size: 1em;
        line-height: 1;
      }
    `;
    document.head.appendChild(style);
  }
}

function applySize(el) {
  const size = String(el.getAttribute('size') || '').trim();
  if (!size) {
    el.style.removeProperty('font-size');
    return;
  }
  el.style.fontSize = /^\d+(\.\d+)?$/.test(size) ? `${size}px` : size;
}

export class SwIcon extends HTMLElement {
  static tag = 'sw-icon';
  static observedAttributes = ['name', 'size', 'label'];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const cls = iconClass(this.getAttribute('name'));
    const label = String(this.getAttribute('label') || this.getAttribute('aria-label') || this.getAttribute('title') || '').trim();
    applySize(this);

    if (label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      if (!this.hasAttribute('aria-label')) this.setAttribute('aria-hidden', 'true');
    }

    this.innerHTML = cls ? `<span class="${cls}" aria-hidden="true"></span>` : '';
  }
}

export function registerComponent() {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(SwIcon.tag)) customElements.define(SwIcon.tag, SwIcon);
}

registerComponent();
ensureIconSheet();
