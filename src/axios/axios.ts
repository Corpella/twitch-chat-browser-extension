import axios, { type AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL as string



interface ApiResponse<T> {
    response?: T;
    error?: ErrorConstructor;
}

const _axios = axios.create({ baseURL });

_axios.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


_axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const post = async <TRequest, TResponse>(
    url: string,
    params: TRequest,
    config?: AxiosRequestConfig
): Promise<ApiResponse<TResponse>> => {
    let response = null;
    let error = null;
    try {
        response = config
            ? await _axios.post(url, params)
            : await _axios.post(url, params, config);
    } catch (err) {
        error = err;
    }

    return { response: response?.data, error } as ApiResponse<TResponse>;
};

export const get = async <TResponse>(
    url: string,
    config?: AxiosRequestConfig
): Promise<ApiResponse<TResponse>> => {
    let response = null;
    let error = null;
    try {
        let payload: AxiosRequestConfig = {};
        let hasPayload = false;
        if (config) {
            payload = config;
            hasPayload = true;
        }

        response = hasPayload
            ? await _axios.get(url, payload)
            : await _axios.get(url);
    } catch (err) {
        error = err;
    }
    return { response: response?.data, error } as ApiResponse<TResponse>;
};