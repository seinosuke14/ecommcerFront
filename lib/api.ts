const BASE = process.env.NEXT_PUBLIC_API_URL!;

// Función helper para obtener los headers con el token
function getHeaders(customHeaders?: HeadersInit): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Agregar token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge con headers personalizados si existen
  if (customHeaders) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, customHeaders);
    }
  }

  return headers;
}

async function toJson<T>(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw { response: { data: errorData } };
  }
  return res.json() as Promise<T>;
}

export const api = {

  json: <T>(p: string, init?: RequestInit) =>
    fetch(`${BASE}${p}`, {
      cache: 'no-store',
      ...init,
      headers: getHeaders(init?.headers)
    }).then(toJson<T>),

  post: <T>(p: string, data: any) =>
    fetch(`${BASE}${p}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      cache: 'no-store'
    }).then(toJson<T>),

  put: <T>(p: string, data: any) =>
    fetch(`${BASE}${p}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
      cache: 'no-store'
    }).then(toJson<T>),

  delete: <T>(p: string) =>
    fetch(`${BASE}${p}`, {
      method: 'DELETE',
      headers: getHeaders(),
      cache: 'no-store'
    }).then(toJson<T>)
};