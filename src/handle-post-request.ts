import { IncomingMessage, ServerResponse } from "node:http";
import { User } from "./types";
import getValidUser from "./utils/get-valid-user";
import users from "./users";
import sendResponse from "./utils/send-response";
import { ERROR_MESSAGE } from "./const";

const handlePostRequest = (req: IncomingMessage, res: ServerResponse) => {
  let validUser: User | null = null;

  let data = "";
  req.on("data", (chunk: Buffer) => {
    data += chunk.toString();
  });

  req.on("close", () => {
    try {
      const user: unknown = JSON.parse(data);
      validUser = getValidUser(user);

      if (validUser) {
        users.push(validUser);
        sendResponse(res, 201, { user: validUser });
      } else {
        sendResponse(res, 400, ERROR_MESSAGE.invalidData);
      }
    } catch (error) {
      if (error instanceof SyntaxError)
        sendResponse(res, 400, ERROR_MESSAGE.invalidJson);
      else sendResponse(res, 500, ERROR_MESSAGE.unknownError);
    }
  });
};

export default handlePostRequest;
