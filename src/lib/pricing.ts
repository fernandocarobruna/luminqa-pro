export function getBulk(c: number) {
  if (c <= 500) return { p: 8.99, con: 1500, w: "1-2 semanas" };
  if (c <= 1000) return { p: 7.99, con: 2500, w: "2-3 semanas" };
  if (c <= 2500) return { p: 6.99, con: 4000, w: "3-4 semanas" };
  if (c <= 5000) return { p: 5.99, con: 6500, w: "4-6 semanas" };
  if (c <= 10000) return { p: 4.99, con: 10000, w: "6-8 semanas" };
  if (c <= 25000) return { p: 3.99, con: 18000, w: "10-12 semanas" };
  return { p: 3.49, con: 30000, w: "14-18 semanas" };
}

export function getLicPrice(q: number) {
  return q <= 5 ? 999 : q <= 14 ? 833 : 714;
}

export function getLicTier(q: number) {
  return q <= 5 ? "Starter" : q <= 14 ? "Professional" : "Enterprise";
}

export function fmt(n: number) {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3).toLocaleString() + "K";
  return "$" + Math.round(n).toLocaleString();
}

export function fmtN(n: number) {
  return n.toLocaleString("en-US");
}
