export function getApiUrl(path: string) {
  const base = `${process.env.URL}${process.env.NEXT_PUBLIC_NETLIFY_URL}`;

  return `${base}${path}`;
}
