import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from '@env';

export interface NormalizedError {
  message: string;
  status: number | undefined;
}

function normalizeError(error: AxiosError): NormalizedError {
  const status = error.response?.status;
  const data = error.response?.data as { status_message?: string } | undefined;
  const message =
    data?.status_message ?? error.message ?? 'Request failed';
  return { message, status };
}

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 25_000,
  headers: {
    Accept: 'application/json',
  },
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const next = { ...config };
  next.headers = next.headers ?? {};
  next.headers.Authorization = `Bearer ${TMDB_ACCESS_TOKEN}`;
  return next;
});

client.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      __retryCount?: number;
    };
    if (!config) {
      return Promise.reject(normalizeError(error));
    }

    const isNetwork =
      !error.response &&
      (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK');

    if (isNetwork && !config.__retryCount) {
      config.__retryCount = 1;
      try {
        const result = await client.request(config);
        return result;
      } catch (retryErr) {
        return Promise.reject(
          normalizeError(retryErr as AxiosError),
        );
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

export { client };
