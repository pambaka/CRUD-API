import { IncomingMessage, ServerResponse } from "node:http";
import { endpoint, ERROR_MESSAGE } from "./const";
import users from "./users";
import isValidUuid from "./utils/is-valid-uuid";
import sendResponse from "./utils/send-response";
import getUserIndex from "./utils/get-user-index";

const handleGetRequest = (req: IncomingMessage, res: ServerResponse) => {
  const urlEndpoint = req.url!;

  if (urlEndpoint === endpoint) {
    sendResponse(res, 200, { users });
  } else {
    const userId = urlEndpoint.split("/")[3];

    if (isValidUuid(userId)) {
      const index = getUserIndex(userId);

      if (index) sendResponse(res, 200, { user: users[index] });
      else sendResponse(res, 404, ERROR_MESSAGE.userNotFound(userId));
    } else {
      sendResponse(res, 400, ERROR_MESSAGE.invalidUuid);
    }
  }
};

export default handleGetRequest;
