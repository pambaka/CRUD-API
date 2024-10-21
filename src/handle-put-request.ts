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
          const user: unknown = JSON.parse(data);

          if (
            user &&
            typeof user === "object" &&
            "username" in user &&
            typeof user.username === "string" &&
            "age" in user &&
            typeof user.age === "number" &&
            "hobbies" in user &&
            Array.isArray(user.hobbies) &&
            user.hobbies.every((hobby) => typeof hobby === "string")
          ) {
            users[index].username = user.username;
            users[index].age = user.age;
            users[index].hobbies = user.hobbies;

            sendResponse(res, 200, { user: users[index] });
          } else sendResponse(res, 400, ERROR_MESSAGE.invalidData);
        } catch (error: unknown) {
          if (error instanceof SyntaxError)
            sendResponse(res, 400, ERROR_MESSAGE.invalidJson);
          else sendResponse(res, 500, ERROR_MESSAGE.unknownError);
        }
      });
    } else sendResponse(res, 404, ERROR_MESSAGE.userNotFound(userId));
  } else sendResponse(res, 400, ERROR_MESSAGE.invalidUuid);
};

export default handlePutRequest;
