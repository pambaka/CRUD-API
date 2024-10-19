import { IncomingMessage, ServerResponse } from "node:http";
import isValidUuid from "./utils/is-valid-uuid";
import sendResponse from "./utils/send-response";
import users from "./users";
import getUserIndex from "./utils/get-user-index";
import { ERROR_MESSAGE } from "./const";

const handleDeleteRequest = (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url!.split("/")[3];

  if (isValidUuid(userId)) {
    const index = getUserIndex(userId);

    if (index === -1)
      sendResponse(res, 404, ERROR_MESSAGE.userNotFound(userId));
    else {
      users.splice(index, 1);

      res.writeHead(204);
      res.end();
    }
  } else sendResponse(res, 400, ERROR_MESSAGE.invalidUuid);
};

export default handleDeleteRequest;
