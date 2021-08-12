import axios from "axios";

const createAxios = (token: null) => {
  const config = {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  };
  const instance = axios.create(config);

  return instance;
};

export const POST = (url: any, data: any, token = null) => createAxios(token).post(url, data);

export const GET = (url: any, data: any, token = null) => createAxios(token).get(url, data);
