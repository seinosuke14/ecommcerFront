const BASE = process.env.NEXT_PUBLIC_API_URL!;
async function toJson<T>(res: Response){ if(!res.ok) throw new Error(await res.text()); return res.json() as Promise<T>; }

export const api = {
  json: <T>(p: string, init?: RequestInit) =>
    fetch(`${BASE}${p}`, { cache: 'no-store', ...init }).then(toJson<T>)
};