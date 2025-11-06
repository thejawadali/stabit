import type { DirectiveBinding } from 'vue'
import { nextTick } from 'vue'

interface LoadingOpts {
  text?: string;
  backgroundColor?: string;
  customClass?: string;
}

function createOverlay(el: HTMLElement, opts: LoadingOpts = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'my‑loading‑overlay';
  if (opts.customClass) {
    overlay.classList.add(...opts.customClass.split(' '));
  }
  if (opts.backgroundColor) {
    overlay.style.background = opts.backgroundColor;
  }

  const spinner = document.createElement('div');
  spinner.className = 'my‑loading‑spinner';
  overlay.appendChild(spinner);

  if (opts.text) {
    const textEl = document.createElement('div');
    textEl.className = 'my‑loading‑text';
    textEl.innerText = opts.text;
    overlay.appendChild(textEl);
  }

  el.appendChild(overlay);
  // store it so we can remove later
  (el as any).__loadingOverlay = overlay;
}

function removeOverlay(el: HTMLElement) {
  const ov = (el as any).__loadingOverlay as HTMLElement | undefined;
  if (ov) {
    el.removeChild(ov);
    delete (el as any).__loadingOverlay;
  }
}

// create directive for loading container
export const vLoading = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | LoadingOpts>) {
    // ensure container is positioned for overlay
    const computedStyle = getComputedStyle(el);
    if (computedStyle.position === 'static') {
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
    }
    toggle(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean | LoadingOpts>) {
    toggle(el, binding);
  },
  unmounted(el: HTMLElement) {
    removeOverlay(el);
  }
};

function toggle(el: HTMLElement, binding: DirectiveBinding<boolean | LoadingOpts>) {
  const value = binding.value;
  let opts: LoadingOpts = {};
  if (value && typeof value === 'object') {
    opts = value as LoadingOpts;
  }
  const show = typeof value === 'boolean' ? value : !!value;

  if (show) {
    // if overlay exists, remove previous
    removeOverlay(el);
    nextTick(() => {
      createOverlay(el, opts);
    });
  } else {
    removeOverlay(el);
  }
}
