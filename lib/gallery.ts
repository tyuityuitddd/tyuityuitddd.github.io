export function wrapIndex(index: number, count: number) {
  return count > 0 ? ((index % count) + count) % count : 0;
}
export function ringDistance(index: number, active: number, count: number) {
  return wrapIndex(index - active + Math.floor(count / 2), count) - Math.floor(count / 2);
}
