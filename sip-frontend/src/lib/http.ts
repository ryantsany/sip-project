const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';

type HttpOptions = RequestInit & {
    headers?: Record<string, string>;
};

async function request<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    const { headers, body, ...rest } = options;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const config = {
        ...rest,
        body,
        headers: {
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            ...headers,
        },
    } as RequestInit;

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    // Handle unauthoized and unauthenticated responses
    if (response.status === 401 || response.status === 403) {
        console.log('Unauthorized or unauthenticated. Redirecting to login.');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }

    return response.json();
}

export const http = {
    get: <T>(endpoint: string, options?: HttpOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, body: unknown, options?: HttpOptions) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: unknown, options?: HttpOptions) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string, options?: HttpOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
    postForm: <T>(endpoint: string, body: FormData, options?: HttpOptions) => request<T>(endpoint, { ...options, method: 'POST', body }),
};
