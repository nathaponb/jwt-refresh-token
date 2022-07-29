import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (config.headers && token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    // if token expire error status_code 401 then intercept the reject by invoking another request call
    // to refresh token.
    const originalConfig = err.config;
    if (originalConfig.url !== "/auth/login" && err.response) {
      // if error response from login route,
      if (err.response.status === 401 && !originalConfig._retry) {
        // TODO: _retry?

        // if 401 "Unauthorized" error
        originalConfig._retry = true;
        try {
          const r = await instance.get("/auth/refreshToken", {
            withCredentials: true,
          });

          localStorage.setItem("accessToken", r.data.accessToken);
          // return r;
          return instance(originalConfig); // re-attempt to verify access token with original request.
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
