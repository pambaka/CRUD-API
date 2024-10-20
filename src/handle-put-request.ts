import { IncomingMessage, ServerResponse } from "node:http";
import getEndpointFromRequest from "./utils/get-endpoint-from-request";
import isValidUuid from "./utils/is-valid-uuid";
import sendResponse from "./utils/send-response";
import { ERROR_MESSAGE } from "./const";
import getUserIndex from "./utils/get-user-index";
import users from "./users";

const handlePutRequest = (req: IncomingMessage, res: ServerResponse) => {
  const urlEndpoint = getEndpointFromRequest(req.url!);
  const userId = urlEndpoint.split("/")[3];

  if (isValidUuid(userId)) {
    const index = getUserIndex(userId);

    if (index >= 0) {
      let data = "";
      req.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });

      req.on("close", () => {
        try {
          let isUserUpdated = false;
          const user: unknown = JSON.parse(data);

          if (user && typeof user === "object") {
            if ("username" in user && typeof user.username === "string") {
              users[index].username = user.username;
              isUserUpdated = true;
            }
            if ("age" in user && typeof user.age === "number") {
              users[index].age = user.age;
              isUserUpdated = true;
            }
            if (
              "hobbies" in user &&
              Array.isArray(user.hobbies) &&
              user.hobbies.every((hobby) => typeof hobby === "string")
            ) {
              users[index].hobbies = user.hobbies;
              isUserUpdated = true;
            }
          }
          if (isUserUpdated) sendResponse(res, 200, { user: users[index] });
          else sendResponse(res, 400, "Nothing to update, check data format");
        } catch (error: unknown) {
          if (error instanceof SyntaxError)
            sendResponse(res, 400, "Wrong JSON format");
          else sendResponse(res, 500, "Something went wrong");
        }
      });
    } else sendResponse(res, 404, ERROR_MESSAGE.userNotFound(userId));
  } else sendResponse(res, 400, ERROR_MESSAGE.invalidUuid);
};

export default handlePutRequest;
