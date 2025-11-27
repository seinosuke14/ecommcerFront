const BASE = process.env.NEXT_PUBLIC_API_URL!;

async function toJson<T>(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw { response: { data: errorData } };
  }
  return res.json() as Promise<T>;
}

export const api = {
  json: <T>(p: string, init?: RequestInit) =>
    fetch(`${BASE}${p}`, { cache: 'no-store', ...init }).then(toJson<T>),

  post: <T>(p: string, data: any) =>
    fetch(`${BASE}${p}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store'
    }).then(toJson<T>),

  put: <T>(p: string, data: any) =>
    fetch(`${BASE}${p}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store'
    }).then(toJson<T>),

  delete: <T>(p: string) =>
    fetch(`${BASE}${p}`, {
      method: 'DELETE',
      cache: 'no-store'
    }).then(toJson<T>)
};