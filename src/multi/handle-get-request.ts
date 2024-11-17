import { dbServerPort, endpointRE, ERROR_MESSAGE, host } from "../const";
import isValidUuid from "../utils/is-valid-uuid";
import getEndpointFromRequest from "../utils/get-endpoint-from-request";
import { User } from "../types";

const handleGetRequest: (req: { method: string; url: string }) => Promise<{
  statusCode: number;
  data: string | Record<string, User | User[] | undefined>;
}> = async (req) => {
  const urlEndpoint = getEndpointFromRequest(req.url);
  const userId = urlEndpoint.split("/")[3];

  const users = await fetch(`http://${host}:${dbServerPort}/users`)
    .then((response) => response.json())
    .then((data) => data);

  if (endpointRE.test(urlEndpoint) || !userId) {
    return { statusCode: 200, data: users };
  } else return { statusCode: 400, data: ERROR_MESSAGE.invalidUuid };
};

export default handleGetRequest;
