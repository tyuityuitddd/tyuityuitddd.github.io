// A visitor's explicit choice takes precedence over the OS default.
export function motionAllowed() {
  const choice = document.documentElement.dataset.motion;
  return choice === 'on' || (choice !== 'off' && !matchMedia('(prefers-reduced-motion: reduce)').matches);
}

export function chooseMotion(enabled: boolean) {
  const choice = enabled ? 'on' : 'off';
  document.documentElement.dataset.motion = choice;
  try { localStorage.setItem('tddd-motion', choice); } catch { /* Optional persistence. */ }
  dispatchEvent(new Event('tddd-motion-change'));
}
