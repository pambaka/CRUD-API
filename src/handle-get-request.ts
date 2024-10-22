import { IncomingMessage, ServerResponse } from "node:http";
import { endpointRE, ERROR_MESSAGE } from "./const";
import users from "./users";
import isValidUuid from "./utils/is-valid-uuid";
import sendResponse from "./utils/send-response";
import getUserIndex from "./utils/get-user-index";
import getEndpointFromRequest from "./utils/get-endpoint-from-request";

const handleGetRequest = (req: IncomingMessage, res: ServerResponse) => {
  const urlEndpoint = getEndpointFromRequest(req.url!);
  const userId = urlEndpoint.split("/")[3];

  if (endpointRE.test(urlEndpoint) || !userId) {
    sendResponse(res, 200, { users });
  } else {
    if (isValidUuid(userId)) {
      const index = getUserIndex(userId);

      if (index >= 0) sendResponse(res, 200, { user: users[index] });
      else sendResponse(res, 404, ERROR_MESSAGE.userNotFound(userId));
    } else {
      sendResponse(res, 400, ERROR_MESSAGE.invalidUuid);
    }
  }
};

export default handleGetRequest;
