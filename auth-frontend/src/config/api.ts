import useAuth from "@/auth/store";
import { refreshToken } from "@/services/AuthService";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "./env";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  // Render free instances sleep when idle; the first request can take 50s+
  timeout: 60000,
});

//every request: before
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let pending: any[] = [];

function queueRequest(cb: any) {
  pending.push(cb);
}

function resolveQueue(newToken: string) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

// response interceptors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // No response at all: network error or timeout (e.g. Render is still waking up)
    if (!error.response) {
      toast.error(
        "Cannot reach the server. It may be waking up, please try again in a few seconds."
      );
      return Promise.reject(error);
    }

    const is401 = error.response.status === 401;
    const original = error.config;

    // Never try to refresh for the auth endpoints themselves,
    // otherwise the refresh call would end up waiting for itself.
    const isAuthCall = /\/auth\/(login|register|refresh)/.test(
      original?.url ?? ""
    );

    if (!is401 || original._retry || isAuthCall) {
      //message:

      if (error.response.data)
        toast.error(error.response.data?.message || "An error occurred");
      console.error("API Error:", error.response.data);

      return Promise.reject(error);
    }

    original._retry = true;
    //we will try to refresh the token:
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueRequest((newToken: string) => {
          if (!newToken) return reject(error);
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(original));
        });
      });
    }

    //start refresh
    isRefreshing = true;

    try {
      const loginResponse = await refreshToken();
      const newToken = loginResponse.accessToken;
      if (!newToken) throw new Error("no access token received");
      useAuth
        .getState()
        .changeLocalLoginData(
          loginResponse.accessToken,
          loginResponse.user,
          true
        );
      //
      resolveQueue(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      resolveQueue("");
      useAuth.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
