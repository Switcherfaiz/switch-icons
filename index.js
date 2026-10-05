import ICON_NAMES from './names.js';

export { ICON_NAMES };

export function iconClass(name) {
  const id = String(name || '').trim().replace(/^switch_icon_/, '');
  return id ? `switch_icon_${id}` : '';
}
