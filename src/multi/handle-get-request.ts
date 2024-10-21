import { endpointRE, ERROR_MESSAGE } from "../const";
import users from "../users";
import isValidUuid from "../utils/is-valid-uuid";
import getUserIndex from "../utils/get-user-index";
import getEndpointFromRequest from "../utils/get-endpoint-from-request";
import { User } from "../types";

const handleGetRequest: (req: { method: string; url: string }) => {
  statusCode: number;
  data: string | Record<string, User | User[] | undefined>;
} = (req) => {
  const urlEndpoint = getEndpointFromRequest(req.url);
  const userId = urlEndpoint.split("/")[3];

  if (endpointRE.test(urlEndpoint) || !userId) {
    return { statusCode: 200, data: { users: users } };
  } else {
    if (isValidUuid(userId)) {
      const index = getUserIndex(userId);

      if (index >= 0) return { statusCode: 200, data: { user: users[index] } };
      return { statusCode: 404, data: ERROR_MESSAGE.userNotFound(userId) };
    } else {
      return { statusCode: 400, data: ERROR_MESSAGE.invalidUuid };
    }
  }
};

export default handleGetRequest;
