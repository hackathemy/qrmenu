import { useSessionStore } from "@hackathemy-qrmenu/store";
import axios from "axios";

export const apiClient = axios.create({});

export const setBaseUrl = (baseURL: string) => {
  apiClient.defaults.baseURL = baseURL;
};

export const setBearerAuthorization = (token: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

let isRefreshing = false;

let failedQueue: {
  reject: (r: unknown) => void;
  resolve: (r: unknown) => void;
}[] = [];

const processQueue = (error: any, token: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async function (error) {
    const config = error.config;
    const response = error.response;

    if (response && response.status) {
      switch (response.status) {
        case 400:
          return Promise.reject(response);
        case 401:
          if (typeof window === "undefined") {
            return Promise.reject(response);
          }
          if (isRefreshing && !config._retry) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                config.headers["Authorization"] = "Bearer " + token;
                return apiClient(config);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          config._retry = true;
          isRefreshing = true;

          const sessionRes = await fetch(
            new URL("/api/session", window.location.origin)
          );

          if (sessionRes.status == 200) {
            const user = await sessionRes.json();
            setBearerAuthorization(user.token.accessToken);
            useSessionStore.getState().setAccessToken(user.token.accessToken);
            config.headers.Authorization = `Bearer ${user.token.accessToken}`;
            processQueue(null, user.token.accessToken);
            return apiClient(config);
          } else {
            processQueue(error, "");
            /** 토큰 갱신 실패시 로그인 화면으로 이동 */
            window.location.replace("/signin");
            isRefreshing = false;
            return Promise.reject(error);
          }
        default:
          return Promise.reject(response);
      }
    }

    return Promise.reject(error);
  }
);
