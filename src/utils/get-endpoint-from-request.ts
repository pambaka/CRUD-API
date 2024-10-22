import { host } from "../const";

const getEndpointFromRequest = (reqUrl: string) => {
  const url = new URL(reqUrl, `http://${host}`);
  return url.pathname;
};

export default getEndpointFromRequest;
