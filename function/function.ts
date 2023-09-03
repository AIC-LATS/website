export function conf2color(conf: number) {
  const r = Math.round(255 * (1 - conf));
  const g = Math.round(255 * conf);
  return `rgb(${r},${g},0)`;
};
