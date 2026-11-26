/** Modo demonstração: faixa fixa + noindex. Ligado por NEXT_PUBLIC_DEMO_MODE=true. */
export function isDemo(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/** URL pública do site (Vercel define VERCEL_PROJECT_PRODUCTION_URL). */
export function siteUrl(): string {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : "http://localhost:3000";
}
